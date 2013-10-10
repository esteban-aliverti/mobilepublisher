var meta={
	use:'action',
    purpose:'save',
    source:'custom',
	type:'form',
	applyTo:'*',
	required:['model','template'],
	name:'asset.lifecycle.action.save'
};

/*
 Description: Saves the lifeCycle field.
 Filename:asset.exporter.js
 Created Dated: 11/8/2013
 */

var module=function(){

    var configs=require('/config/publisher.json');
    var log=new Log();

	return{
		execute:function(context){

           log.debug('Entered : '+meta.name);

           var model=context.model;
           var template=context.template;
           var type=template.shortName;

           log.info('Entered '+meta.name);
           log.debug(stringify(context.actionMap));

           //Get the id of the model
           var id=model.getField('*.id').value;

           //Invoke an api call with the life cycle state
           var lifeCycle=model.getField('*.lifeCycle').value;

           var rxtManager=context.rxtManager;

           var artifactManager=rxtManager.getArtifactManager(type);

           var asset=context.parent.export('asset.exporter');

           log.info('Attempting to attach the lifecycle :'+lifeCycle+'to asset with id: '+id);

           artifactManager.attachLifecycle(lifeCycle,asset);

           log.debug('Finished attaching the lifecycle to the asset'+stringify(asset));

           log.debug('Check if there is an action to be performed when attaching a life-cycle');

            var invokeAction='';

            //Check the config for a lifeCycleBehaviour block
            utility.isPresent(config,'lifeCycleBehaviour',function(lifeCycleBehaviour){

                utility.isPresent(lifeCycleBehaviour,lifeCycle,function(lifeCycleData){

                    utility.isPresent(lifeCycleData,'onAttach',function(onAttach){

                        invokeAction=onAttach.action||'';

                    });
                });

            });

            //Check if an action needs to be invoked.
           if(invokeAction!=''){

               log.debug('Invoke Action: '+invokeAction);

               var asset=artifactManager.get(asset.id);

               artifactManager.promoteLifecycleState(invokeAction,asset);
			   var state=artifactManager.getLifecycleState(artifact);
			   if(state=='In-Review'){
				//Send email to Reviewer 
				//
				var server = require('/modules/server.js');
				var um = server.userManager(tenantId);
				um.getUserListOfRole("reviewer");
				for(var j = 0; j < userList.length; j++) {
					var userEmail =userList[j];
					sendEmail(userEmail, "There is an app that needs to be reviewed. You can download the app from the Publisher. ");
				}
			   }else if(state='Published'){
				//send email to developer
					sendEmail(asset.provider, "Your app has been reviewed and published");
			   }
               log.debug('Asset has been '+invokeAction+'ed to the next state.');
           }


		}
	};
};

var sendEmail = function(email, template){
	var mam_config = require('/config/mam-config.json');
    content = template;
    subject = "App Notification";

    var email = require('email');
    var sender = new email.Sender("smtp.gmail.com", "25", mam_config.email.senderAddress, mam_config.email.emailPassword, "tls");
    sender.from = mam_config.email.senderAddress;

    sender.to = email;
    sender.subject = subject;
    sender.text = content;
    sender.send();
};

