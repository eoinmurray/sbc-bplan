/*global sbc2, Backbone*/

sbc2.Models = sbc2.Models || {};

(function () {
	'use strict';

	sbc2.Models.DocumentModel = Backbone.Model.extend({

		defaults : {
			"businessname" : 											{ value : "", active : true},
			"yourname" : 												{ value : "", active : true},
			"yourphonenumber" : 										{ value : "", active : true},
			"youremail" : 												{ value : "", active : true},
			"street1" : 												{ value : "", active : true},
			"street2" : 												{ value : "", active : true},
			"town" : 													{ value : "", active : true},
			"county" : 													{ value : "", active : true},
			"ceoname" : 												{ value : "", active : true},
			"profile1" : 												{ value : "", active : true},
			"profile2" : 												{ value : "", active : true},
			"profile3" : 												{ value : "", active : true},
			"profile4" : 												{ value : "", active : true},
			"website" : 												{ value : "", active : true},
			"industrysector" : 										{ value : "", active : true},
			"yearestablished" : 										{ value : "", active : true},
			"currentfinancialyear" : 								{ value : "", active : true},
			"currency" : 												{ value : "", active : true},
			"mostrecent2" : 											{ value : "", active : true},
			"mostrecent" : 											{ value : "", active : true},
			"nextyear1" : 												{ value : "", active : true},
			"nextyear2" : 												{ value : "", active : true},
			"nextyear3" : 												{ value : "", active : true},
			"vision" : 													{ value : "", active : true},
			"milestones" : 											{ value : "", active : true},
			"targets" : 												{ value : "", active : true},
			"purpose" : 												{ value : "", active : true},
			"passion" : 												{ value : "", active : true},
			"guidingprinciples" : 									{ value : "", active : true},
			"positioning" : 											{ value : "", active : true},
			"resources" : 												{ value : "", active : true},
			"purposeofplan" : 										{ value : "", active : true},
			"productsservicesandbenifits" : 						{ value : "", active : true},
			"marketopportunity" : 									{ value : "", active : true},
			"aboutyourbusiness" : 									{ value : "", active : true},
			"businessmodel" : 										{ value : "", active : true},
			"visionandmission" : 									{ value : "", active : true},
			"managmentteam" : 										{ value : "", active : true},
			"describeyourproduct" : 								{ value : "", active : true},
			"marketoverview" : 										{ value : "", active : true},
			"marketneeds" : 											{ value : "", active : true},
			"keycustomers" : 											{ value : "", active : true},
			"benifittocustomers" : 									{ value : "", active : true},
			"competitors" : 											{ value : "", active : true},
			"marketingoverview" : 									{ value : "", active : true},
			"pricing" : 												{ value : "", active : true},
			"promotion" : 												{ value : "", active : true},
			"salesplan" : 												{ value : "", active : true},
			"competitiveedge" : 										{ value : "", active : true},
			"strengths" : 												{ value : "", active : true},
			"weaknesses" : 											{ value : "", active : true},
			"opportunities" : 										{ value : "", active : true},
			"threats" : 												{ value : "", active : true},
			"distributionstrategy" : 								{ value : "", active : true},
			"roadmap" : 												{ value : "", active : true},
			"randd" : 													{ value : "", active : true},
			"copyrightspatents" : 									{ value : "", active : true},
			"employees" : 												{ value : "", active : true},
			"locationsandfacilities" : 							{ value : "", active : true},
			"managmentstructure" : 									{ value : "", active : true},
			"technology" : 											{ value : "", active : true},

			"superheaders" : {
				"companydetails" : 									{active : true},
				"executivesummary": 									{active : true},
				"strategy": 											{active : true},
				"businessdescription": 								{active : true},
				"managmentteamsuper": 								{active : true},
				"productsandservices": 								{active : true},
				"targetmarket": 										{active : true},
				"marketingplan": 										{active : true},
				"researchanddevelopment": 							{active : true},
				"operationsandemployment": 						{active : true},
				"financialplan": 										{active : true}
			}
		},

		initialize : function(attr, opts){
			var self = this
			this.firebase = opts.firebase;

			this.firebase.on('value', function(snapshot){
				self.set(snapshot.val())
				self.trigger('fetch')
			})
		},

		save : function(){
			this.firebase.set(this.toJSON())
		},

		reset : function(){
			this.clear().set(this.defaults);
			this.trigger('reset')
			this.save()
		}

	});

})();
