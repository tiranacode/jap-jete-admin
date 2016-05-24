import Rest from './Rest';
import {Endpoints} from './../configs/Url';
import CommonUtils from './Commons'

module.exports = {
    
    Login(user, pass, success, error){
        console.log(user);
        
        Rest.createJSON(Endpoints.Login, {
            username: user,
            password: pass
        }, (res) => {
            
            if(res.status && res.status == "Failed"){
                console.log(res.message);
                this.onChange(false);
                error(res.message);
            }
            else if(res && res.id){
                var id = res.id;
                var session_token = res.session_token;
                
                localStorage.setItem("id", id);
                localStorage.setItem("session_token", session_token);
                
                this.onChange(true);
                success();
            }
            
        }, (err) => {
            console.error(err);
        });
        
    },
    
    GetSession(){
        var id = localStorage.getItem("id");
        var session_token = localStorage.getItem("session_token");
        
        if(id && session_token)
            return {
                hospital_id: id,
                session_token: session_token
            };
            
        return {};
    },
    
    GetSessionAsParams(){
        var data = this.GetSession();
        
        return CommonUtils.getQueryStringFromObject(data);  
    },
    
    LoggedIn(){
        return !!localStorage.session_token;
    },
    
    Logout(){
        localStorage.removeItem("id");
        localStorage.removeItem("session_token");
        this.onChange();
    },
    
    onChange(){}
};