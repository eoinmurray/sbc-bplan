/*global sbc2, Backbone*/

sbc2.Models = sbc2.Models || {};

(function () {
    'use strict';

    sbc2.Models.UserModel = Backbone.Model.extend({

    	initializer: function(){

            var self = this;
    		this.firebase = new Firebase('https://sbc.firebaseio.com/');
            this.auth = new FirebaseSimpleLogin(this.firebase, function(error, user) {
                self.handleAuth(error, user)
            });

            window.user = this;

    	},

        handleAuth : function(error, user){
            if (error) this.trigger('loginFailed', error)

            else if (user) {
                this.set({'id' : user.id})
                this.set({'provider' : user.provider})
                this.set({'firebaseAuthToken' : user.firebaseAuthToken})
                this.set({'md5_hash' : user.md5_hash})
                this.set({'uid' : user.uid})
                this.set({'email' : user.email})
                this.trigger('login')
            }

            else this.trigger('needLogin')
        },

    	login : function(callback){
    		this.auth.login('password', {
                email: this.get('email'),
                password: this.get('password'),
                rememberMe: this.get('rememberMe')
            });
    	},

    	logout : function(){
    		this.auth.logout()
    		window.location.reload()
    	},

    	signup : function(callback){
    		var self = this
    		this.auth.createUser(this.get('email'), this.get('password'), function(error, user) {
    			if(error) callback(error)
  				if (!error) self.login()
			});
    	},

        reset : function(){
            var email = prompt("What is your email?")
            if (email) {
                this.auth.sendPasswordResetEmail(email, function(error, success) {
                    if (!error) {
                        alert('Password reset email sent.');
                    }

                    else if(error){
                        if (error["code"] === "INVALID_EMAIL") {
                            alert('That email is not tied to an account.');
                        }
                    }

                    else{
                        alert('Somethings gone wrong, try again.');
                    }
                });
            }
        },

        changePass : function(){
            var oldPass = prompt('Enter current password');
            if(!oldPass) return;

            var newPass = prompt('Enter new password');
            if(!newPass) return;

            this.auth.changePassword(this.get('email'), oldPass, newPass, function(error, success) {
                console.log(error, success)

                if (!error) {
                    alert('Password changed successfully');
                    location.reload();
                }

                else if(error["code"] === "INVALID_PASSWORD"){
                    alert("Entered current password incorrectly")
                }

                else{
                    alert("Somethings gone wrong, try again.")
                }
            });

        }
    });

})();