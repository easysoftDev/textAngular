describe('textAngularManager', function(){
	'use strict';
	beforeEach(module('textAngular'));
	
	describe('toolbar', function(){
		describe('registration', function(){
			it('should require a scope object', inject(function(textAngularManager){
				expect(textAngularManager.registerToolbar).toThrow("textAngular Error: A toolbar requires a scope");
			}));
			
			it('should require a name', inject(function(textAngularManager){
				expect(function(){textAngularManager.registerToolbar({});}).toThrow("textAngular Error: A toolbar requires a name");
				expect(function(){textAngularManager.registerToolbar({name: ''});}).toThrow("textAngular Error: A toolbar requires a name");
			}));
			
			it('should require a unique name', inject(function(textAngularManager){
				textAngularManager.registerToolbar({name: 'test'});
				expect(function(){textAngularManager.registerToolbar({name: 'test'});}).toThrow('textAngular Error: A toolbar with name "test" already exists');
			}));
		});
		
		describe('retrieval', function(){
			it('should be undefined for no registered toolbar', inject(function(textAngularManager){
				expect(textAngularManager.retrieveToolbar('test')).toBeUndefined();
			}));
			
			it('should get the correct toolbar', inject(function(textAngularManager){
				var scope = {name: 'test'};
				textAngularManager.registerToolbar(scope);
				expect(textAngularManager.retrieveToolbar('test')).toBe(scope);
			}));
			
			it('should get the correct toolbar via editor', inject(function(textAngularManager){
				var scope = {name: 'test'};
				textAngularManager.registerToolbar(scope);
				textAngularManager.registerEditor('testeditor', {}, ['test']);
				expect(textAngularManager.retrieveToolbarsViaEditor('testeditor')[0]).toBe(scope);
			}));
		});
		
		describe('unregister', function(){
			it('should get the correct toolbar', inject(function(textAngularManager){
				textAngularManager.registerToolbar({name: 'test'});
				textAngularManager.unregisterToolbar('test');
				expect(textAngularManager.retrieveToolbar('test')).toBeUndefined();
			}));
		});
		
		describe('modification', function(){
			var $rootScope, toolbar1, toolbar2, textAngularManager;
			beforeEach(inject(function(_textAngularManager_){
				textAngularManager = _textAngularManager_;
			}));
			beforeEach(inject(function (_$compile_, _$rootScope_) {
				$rootScope = _$rootScope_;
				toolbar1 = _$compile_('<text-angular-toolbar name="test1"></text-angular-toolbar>')($rootScope);
				toolbar2 = _$compile_('<text-angular-toolbar name="test2"></text-angular-toolbar>')($rootScope);
				$rootScope.$digest();
			}));
			
			describe('single toolbar', function(){
				// we test these by adding an icon with a specific class and then testing for it's existance
				it('should update only one button on one toolbar', function(){
					textAngularManager.updateToolbarToolDisplay('test1', 'h1', {iconclass: 'test-icon-class'});
					expect(jQuery('i.test-icon-class', toolbar1).length).toBe(1);
					expect(jQuery('i.test-icon-class', toolbar2).length).toBe(0);
				});
				it('should reset one toolbar button on one toolbar', function(){
					textAngularManager.updateToolbarToolDisplay('test1', 'h1', {iconclass: 'test-icon-class'});
					textAngularManager.updateToolbarToolDisplay('test1', 'h2', {iconclass: 'test-icon-class2'});
					textAngularManager.resetToolbarToolDisplay('test1', 'h1');
					expect(jQuery('[name="h1"] i.test-icon-class', toolbar1).length).toBe(0);
					expect(jQuery('[name="h1"] i.test-icon-class', toolbar2).length).toBe(0);
					expect(jQuery('[name="h2"] i.test-icon-class2', toolbar1).length).toBe(1);
				});
			});
			describe('multi toolbar', function(){
				it('should update only one button on multiple toolbars', function(){
					textAngularManager.updateToolDisplay('h1', {iconclass: 'test-icon-class'});
					expect(jQuery('[name="h1"] i.test-icon-class', toolbar1).length).toBe(1);
					expect(jQuery('[name="h1"] i.test-icon-class', toolbar2).length).toBe(1);
				});
				it('should reset one toolbar button', function(){
					textAngularManager.updateToolDisplay('h1', {iconclass: 'test-icon-class'});
					textAngularManager.updateToolDisplay('h2', {iconclass: 'test-icon-class2'});
					textAngularManager.resetToolDisplay('h1');
					expect(jQuery('[name="h1"] i.test-icon-class', toolbar1).length).toBe(0);
					expect(jQuery('[name="h1"] i.test-icon-class', toolbar2).length).toBe(0);
					expect(jQuery('[name="h2"] i.test-icon-class2', toolbar1).length).toBe(1);
				});
				it('should update multiple buttons on multiple toolbars', function(){
					textAngularManager.updateToolsDisplay({'h1': {iconclass: 'test-icon-class'},'h2': {iconclass: 'test-icon-class2'}});
					expect(jQuery('[name="h1"] i.test-icon-class, [name="h2"] i.test-icon-class2', toolbar1).length).toBe(2);
					expect(jQuery('[name="h1"] i.test-icon-class, [name="h2"] i.test-icon-class2', toolbar2).length).toBe(2);
				});
				it('should reset all toolbar buttons', function(){
					textAngularManager.updateToolsDisplay({'h1': {iconclass: 'test-icon-class'},'h2': {iconclass: 'test-icon-class2'}});
					textAngularManager.resetToolsDisplay();
					expect(jQuery('[name="h1"] i.test-icon-class, [name="h2"] i.test-icon-class2', toolbar1).length).toBe(0);
					expect(jQuery('[name="h1"] i.test-icon-class, [name="h2"] i.test-icon-class2', toolbar2).length).toBe(0);
				});
			});
		});
	});
	
	describe('editor', function(){
		describe('registration', function(){
			it('should require a name', inject(function(textAngularManager){
				expect(textAngularManager.registerEditor).toThrow("textAngular Error: An editor requires a name");
				expect(function(){textAngularManager.registerEditor('');}).toThrow("textAngular Error: An editor requires a name");
			}));
			
			it('should require a scope object', inject(function(textAngularManager){
				expect(function(){textAngularManager.registerEditor('test');}).toThrow("textAngular Error: An editor requires a scope");
			}));
			
			it('should require a unique name', inject(function(textAngularManager){
				textAngularManager.registerEditor('test', {});
				expect(function(){textAngularManager.registerEditor('test', {});}).toThrow('textAngular Error: An Editor with name "test" already exists');
			}));
			
			it('should return a disable function', inject(function(textAngularManager){
				expect(textAngularManager.registerEditor('test', {}).disable).toBeDefined();
			}));
			
			it('should return a enable function', inject(function(textAngularManager){
				expect(textAngularManager.registerEditor('test', {}).enable).toBeDefined();
			}));
			
			it('should return a focus function', inject(function(textAngularManager){
				expect(textAngularManager.registerEditor('test', {}).focus).toBeDefined();
			}));
			
			it('should return a unfocus function', inject(function(textAngularManager){
				expect(textAngularManager.registerEditor('test', {}).unfocus).toBeDefined();
			}));
			
			it('should return a updateSelectedStyles function', inject(function(textAngularManager){
				expect(textAngularManager.registerEditor('test', {}).updateSelectedStyles).toBeDefined();
			}));
		});
		
		describe('retrieval', function(){
			it('should be undefined for no registered editor', inject(function(textAngularManager){
				expect(textAngularManager.retrieveEditor('test')).toBeUndefined();
			}));
			
			it('should get the correct editor', inject(function(textAngularManager){
				var scope = {};
				textAngularManager.registerEditor('test', scope);
				expect(textAngularManager.retrieveEditor('test').scope).toBe(scope);
			}));
		});
		
		describe('unregister', function(){
			it('should get the correct editor', inject(function(textAngularManager){
				textAngularManager.registerEditor('test', {});
				textAngularManager.unregisterEditor('test');
				expect(textAngularManager.retrieveEditor('test')).toBeUndefined();
			}));
		});
		
		describe('interacting', function(){
			var $rootScope, textAngularManager, editorFuncs, testbar1, testbar2, testbar3;
			var editorScope = {};
			beforeEach(inject(function(_textAngularManager_){
				textAngularManager = _textAngularManager_;
			}));
			beforeEach(inject(function (_$compile_, _$rootScope_) {
				$rootScope = _$rootScope_;
				$rootScope.htmlcontent = '<p>Test Content</p>';
				textAngularManager.registerToolbar((testbar1 = {name: 'testbar1', disabled: true}));
				textAngularManager.registerToolbar((testbar2 = {name: 'testbar2', disabled: true}));
				textAngularManager.registerToolbar((testbar3 = {name: 'testbar3', disabled: true}));
				editorFuncs = textAngularManager.registerEditor('test', editorScope, ['testbar1','testbar2']);
				$rootScope.$digest();
			}));
			describe('focus', function(){
				beforeEach(function(){
					editorFuncs.focus();
					$rootScope.$digest();
				});
				it('should set disabled to false on toolbars', function(){
					expect(!testbar1.disabled);
					expect(!testbar2.disabled);
					expect(testbar3.disabled);
				});
				it('should set the active editor to the editor', function(){
					expect(testbar1._parent).toBe(editorScope);
					expect(testbar2._parent).toBe(editorScope);
					expect(testbar3._parent).toNotBe(editorScope);
				});
			});
			describe('unfocus', function(){
				beforeEach(function(){
					editorFuncs.unfocus();
					$rootScope.$digest();
				});
				it('should set disabled to false on toolbars', function(){
					expect(testbar1.disabled);
					expect(testbar2.disabled);
					expect(!testbar3.disabled);
				});
			});
			describe('enable', function(){
				beforeEach(function(){
					editorFuncs.disable();
					$rootScope.$digest();
				});
				it('should set disabled to false on toolbars', function(){
					expect(!testbar1.disabled);
					expect(!testbar2.disabled);
					expect(testbar3.disabled);
				});
			});
			describe('disable', function(){
				beforeEach(function(){
					editorFuncs.disable();
					$rootScope.$digest();
				});
				it('should set disabled to false on toolbars', function(){
					expect(testbar1.disabled);
					expect(testbar2.disabled);
					expect(!testbar3.disabled);
				});
			});
		});
		
		describe('updating', function(){
			var $rootScope, element;
			beforeEach(inject(function (_$compile_, _$rootScope_) {
				$rootScope = _$rootScope_;
				$rootScope.htmlcontent = '<p>Test Content</p>';
				element = _$compile_('<text-angular name="test" ng-model="htmlcontent"></text-angular>')($rootScope);
				$rootScope.$digest();
			}));
			it('should throw error for named editor that doesn\'t exist', inject(function(textAngularManager){
				expect(function(){textAngularManager.refreshEditor('non-editor');}).toThrow('textAngular Error: No Editor with name "non-editor" exists');
			}));
			it('should update from text view to model', inject(function(textAngularManager){
				jQuery('.ta-text', element).append('<div>Test 2 Content</div>');
				textAngularManager.refreshEditor('test');
				expect($rootScope.htmlcontent).toBe('<p>Test Content</p><div>Test 2 Content</div>');
			}));
		});
	});
});