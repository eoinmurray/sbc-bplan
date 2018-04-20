/*global sbc2, Backbone, JST*/

sbc2.Views = sbc2.Views || {};

(function () {
	'use strict';

	sbc2.Views.AppView = Backbone.View.extend({

		initialize : function(){

			this.authorize()

			this.$pdfGenerateButton = $('a[href$=pdf]')
			this.$wordGenerateButton = $('a[href$=word]')
			this.$pdfFetchButton = $('a[href$=pdf_fetch]')
			this.$wordFetchButton = $('a[href$=word_fetch]')
			this.$clearButton = $('#resetDocument')

			$('[data-toggle="tooltip"]').tooltip({'placement': 'right', 'trigger':'click'});
			this.$sidebar = $('.sidebar')
			this.hashFragment = ''
		},

		authorize : function(){
			this.userView = new sbc2.Views.UserView({
				el : $('.user'),
				model : this.model.get('user')
			})

			this.model.get('user').on('login', function(){
				$('.main').removeClass('hidden')
				this.userView.remove()
				this.initializeEvents()
				this.initializeViews()
				this.checkConvertServer()
				this.render()
			}, this)
		},

		checkConvertServer : function(){
			var self = this
			self.$pdfGenerateButton.html('')
			self.$wordGenerateButton.html('')
			$.get( sbc2.convert_server, function( data ) {
				if(data.ping === true){
					self.$pdfGenerateButton.html('<i class="fa fa-cloud-download"></i> Pdf generate')
					self.$wordGenerateButton.html('<i class="fa fa-cloud-download"></i> Word generate')
				}
			});
		},

		render : function(){
			this.$sidebar.removeClass('hidden')
		},

		navigate : function(path){
			if(path === "word_fetch" || path === "pdf_fetch") return;
			$('#'+this.hashFragment).addClass('hidden')
			this.hashFragment = path
			$('#'+this.hashFragment).removeClass('hidden')
		},

		initializeEvents: function(){
			var self = this

			this.$pdfFetchButton.on('click', function(e){self.fetchFile(e)})
			this.$wordFetchButton.on('click', function(e){self.fetchFile(e)})

			this.$sidebar.find('a').on('click', function(e){ self.sidebarLinkClick(e) })
			this.$clearButton.click(function(e){ self.sidebarClearClick() })
			this.model.on('navigate', function(path){ this.navigate(path) }, this)
			this.model.on('download', function(type){ this.fileConvertRequest(type) }, this)
			this.model.on('clear', function(){ this.sidebarClearClick() }, this)
		},

		initializeViews : function(){
			this.model.set({'documentView': new sbc2.Views.DocumentView({
				model : this.model.get('document'),
				el : $('.main')
			})})
			if(window.location.hash === ""){
				this.model.get('router').navigate('companydetails')
			}
		},

		sidebarLinkClick : function(e){
			e.preventDefault()
			var link = e.target.hash.slice(1)
			this.model.get('router').navigate(link, {trigger: true})
		},

		sidebarClearClick : function(){
			this.model.get('document').reset()
		},

		fileConvertRequest : _.debounce(function(type){
			this.beforeRequest(type)
			var self = this
			$.ajax({
				type: "POST",
				url: sbc2.convert_server + type + '_convert',
				data: {id : self.model.get('user').toJSON().id},
				success: function(success, response){
					if(success.success === true) self.convertSuccess(type)
					else self.convertError(type, success.error)
					},
				error : function(){self.convertError(type, success.error)}
			});
		}, 500, true),

		beforeRequest : function(type){
			var button = $('a[href$='+type+']');
			// this.$pdfGenerateButton.html('<i class="fa fa-cloud-download"></i> Pdf generate')
			this.$wordGenerateButton.html('<i class="fa fa-cloud-download"></i> Word generate')
			this.originalHtml = button.html()
			button.html('<i class="fa fa-spin fa-spinner"></i> This might take a sec.')
		},

		convertSuccess : function(type){
			console.log(type)
			var button = $('a[href$='+type+']');
			var fetchButton = $('a[href$='+type+'_fetch]');
			button.html(this.originalHtml);
			button.addClass('hidden')
			fetchButton.removeClass('hidden')

			this.fetchType = type
		},

		fetchFile : function(e){
			e.stopPropagation()
			e.preventDefault()
			if(!this.fetchType) return;

			window.location  = sbc2.convert_server + this.fetchType + '/' + this.model.get('user').toJSON().id
			var button = $('a[href$='+this.fetchType+']');
			var fetchButton = $('a[href$='+this.fetchType+'_fetch]');
			button.html(this.originalHtml);
			button.removeClass('hidden')
			fetchButton.addClass('hidden')
			return false;
		},

		convertError : function(type, error){
			var button = $('a[href$='+type+']');
			button.html(error)
		},


	});

})();
