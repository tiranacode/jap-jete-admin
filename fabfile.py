from fabric.api import task, local, run, cd, sudo
from fabric.contrib.files import upload_template
from fabric.context_managers import settings
from fabric.operations import put
from fabric import state


import os
from boto import ec2

config = {
    'server_name': 'tiranacode',
    'port': 80,
    'remote_install_dir': '/home/ubuntu/tiranacode',
    'package_name': 'package.tar.gz',
    'deploy_content': [
        'src',
        'requirements.txt',
    ],
    'dependencies': [
        'python-pip',
        'ipython',
        'build-essential',
        'python-dev'
    ],
    'region': 'eu-central-1',
    'instance_name': 'tiranacode'
}


### BEGIN: Get instance IPs using boto.ec2
conn = ec2.connect_to_region(config['region'])
reservations = conn.get_all_instances(filters={
    'tag:Name' : config['instance_name']
})
instances = [i for r in reservations for i in r.instances]
if len(instances) == 0:
    print 'Could not find any instances with name: %s on region: %s' % (
        config['instance_name'],
        config['region']
    )
    sys.exit(1)

state.env.user = 'ubuntu'
state.env.hosts = [instance.ip_address for instance in instances]
### END: Get instance IPs using boto.ec2

@task
def upload_ssh_keys():
    pub_keys_folder = 'deploy/pub_keys'
    for key_fname in os.listdir(pub_keys_folder):
        local_loc = os.path.join(pub_keys_folder, key_fname)
        remote_loc = os.path.join('/tmp', key_fname)
        put(local_loc, remote_loc)
        sudo('cat %s >> /root/.ssh/authorized_keys' % remote_loc)
        sudo('cat %s >> /home/ubuntu/.ssh/authorized_keys' % remote_loc)
@task
def deploy_code():
    # compress local folder
    local('tar -zcvf %s %s' % (
        config['package_name'], ' '.join(config['deploy_content'])
    ))

    # upload package and delete local folder
    run('mkdir -p %s' % config['remote_install_dir'])
    put(config['package_name'], config['remote_install_dir'])
    local('rm %s' % config['package_name'])

    # uncompress on the remote server and remove compressed package
    with cd(config['remote_install_dir']):
        run('tar -zxvf %s' % config['package_name'])
        run('rm %s' % config['package_name'])


@task
def install_dependencies():
    sudo('apt-get update')
    for dep in config['dependencies']:
        sudo('apt-get -y install %s' % dep)
    with cd(config['remote_install_dir']):
        sudo("pip install -r requirements.txt")

@task
def install_service():
    upload_template('deploy/upstart.tpl.conf',
                    '/etc/init/%s.conf' % config['server_name'],
                    context={
                        'install_dir': config['remote_install_dir'],
                        'port': config['port'],
                        'server_name': config['server_name']
                    }, use_sudo=True)
    sudo('initctl reload-configuration')

@task
def restart_service():
    sudo('service %s restart' % config['server_name'])

@task
def redeploy():
    deploy_code()
    restart_service()

@task
def full_install():
    upload_ssh_keys()
    deploy_code()
    install_dependencies()
    install_service()
    restart_service()
