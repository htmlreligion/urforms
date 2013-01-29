/**
 * jQuery urForms Plugin
 * Copyright: htmlReligion Team
 * URL: http://research.htmlreligion.com/custom-forms/
 * Version: 2.0.5 (2011-dec-21)
 * Requires: jQuery v1.3+
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
(function($) {
	var UrForm = function(element, options) {
		var elem = $(element);
		var obj = this;
		
		// default options for plugin
		var settings = $.extend({
			replaceRadios : false,
			replaceCheckboxes : false,
			replaceSelects : false,
			implementedClass : 'customizedForm',
			customizedClass : 'customizedElement',
			noCustomClass : 'no-transform',
			radioClass : 'customRadio',
			radioClassChecked : 'customRadioChecked',
			checkboxClass : 'customCheckbox',
			checkboxClassChecked : 'customCheckboxChecked',
			selectOptionHTML : '<div><ul>{options}</ul></div>',
			selectOptionItem : '<li><a href="#">{optionItem}</a></li>',
			selectClass : 'customSelect',
			selectDisabledClass : 'disabled-select',
			optionsClass : 'customOptions',
			optionsHiddenClass : 'customOptionsHidden',
			selectActiveClass : 'customSelectActive',
			selectHeight: false,
			flexibleSelects: false,
			selectImplemented : false,
			hideOnResize: true,
			hideOnScroll: false
		}, options || {});
		
		// init
		obj.initialize = function() {
			if (!$(this).hasClass(settings.implementedClass)) {
				
				obj.elements = {};
				
				// get form relations
				obj.getRelations();
				
				// replace radios
				if (settings.replaceRadios) {
					obj.customizeRadios();
				}
				
				// replace checkboxes
				if (settings.replaceCheckboxes) {
					obj.customizeCheckboxes();
				}
				
				// replace selects
				if (settings.replaceSelects) {
					obj.customizeSelects();
				}
				
				$(this).addClass(settings.implementedClass);
			}
		};
		
		// public
		// get form relations
		obj.getRelations = function() {
			// get elements
			obj.elements.inputs = [];
			obj.elements.selects = [];
			obj.elements.labels = [];
			elem.find('input').each(function () {
				if (!$(this).hasClass(settings.customizedClass) && !$(this).hasClass(settings.noCustomClass)) {
					obj.elements.inputs.push($(this));
				}
			});
			$('select', elem).each(function () {
				if (!$(this).hasClass(settings.customizedClass) && !$(this).hasClass(settings.noCustomClass)) {
					obj.elements.selects.push($(this));
				}
			});
			$('label', elem).each(function () {
				try {
					var labelFor = $(this).attr('for');
					if (labelFor && $('#' + labelFor).length) {
						if(!$('#' + labelFor).hasClass(settings.customizedClass) && !$('#' + labelFor).hasClass(settings.noCustomClass)) {
							obj.elements.labels.push($(this));
						}
					}
				} catch (labErr) {}
			});
			
			// get relations
			obj.elements.radios = [];
			obj.elements.radioLabels = [];
			obj.elements.checkboxes = [];
			obj.elements.checkboxLabels = [];
			
			var _rCount = 0;
			var _cCount = 0;
			
			for (i=0; i<obj.elements.inputs.length; i++) {
				if (obj.elements.inputs[i].attr('type') == "radio") {
					obj.elements.radios.push(obj.elements.inputs[i]);
					for (var _lCount=0; _lCount<obj.elements.labels.length; _lCount++) {
						if (obj.elements.inputs[i].attr('id') && obj.elements.labels[_lCount].attr('for') == obj.elements.inputs[i].attr('id')) {
							obj.elements.labels[_lCount].attr('targetId', _rCount);
							obj.elements.radioLabels.push(obj.elements.labels[_lCount]);
						}
					}
					_rCount++;
				}
				if (obj.elements.inputs[i].attr('type') == "checkbox") {
					obj.elements.checkboxes.push(obj.elements.inputs[i]);
					for (var _lCount=0; _lCount<obj.elements.labels.length; _lCount++) {
						if (obj.elements.inputs[i].attr('id') && obj.elements.labels[_lCount].attr('for') == obj.elements.inputs[i].attr('id')) {
							obj.elements.labels[_lCount].attr('targetId', _cCount);
							obj.elements.checkboxLabels.push(obj.elements.labels[_lCount]);
						}
					}
					_cCount++;
				}
			}
		};
		
		// public
		// replace input[type=checkbox]'s
		obj.customizeCheckboxes = function() {
			for (i=0, chn=obj.elements.checkboxes.length; i<chn; i++) {
				if (!obj.elements.checkboxes[i].hasClass(settings.customizedClass)) {
					obj.elements.checkboxes[i].addClass(settings.customizedClass);
					var replacedInputCheckbox = $('<div></div>');
					if (obj.elements.checkboxes[i].attr('checked') == true) {
						replacedInputCheckbox.addClass(settings.checkboxClassChecked);
					} else {
						replacedInputCheckbox.addClass(settings.checkboxClass);
					}
					replacedInputCheckbox.attr('customCheckboxId', 'customCheckbox' + i);
					obj.elements.checkboxes[i].parent().prepend(replacedInputCheckbox);
					obj.elements.checkboxes[i].custom = replacedInputCheckbox;
					replacedInputCheckbox.click(function () {
						var clickIndex = $(this).attr('customCheckboxId').replace('customCheckbox', '');
						retoggleCheckbox (clickIndex);
					});
				}
			}
			for (i=0, chln=obj.elements.checkboxLabels.length; i<chln; i++) {
				var _forAttr = obj.elements.checkboxLabels[i].attr('for');
				if (_forAttr && $('#' + _forAttr).length) {
					if (obj.elements.checkboxLabels[i].attr('targetId')) {
						obj.elements.checkboxLabels[i].click(function () {
							toggleCheckbox ($(this).attr('targetId'));
						});
					}
				}
			}
		};
		
		// private
		// retoggle checkboxes
		function retoggleCheckbox (_clickIndex) {
			var _state = false;
			if(obj.elements.checkboxes[_clickIndex].attr('checked') == true) {
				_state = false;
			} else {
				_state = true;
			}
			obj.elements.checkboxes[_clickIndex].attr('checked', _state);
			checkCheckbox(_clickIndex, _state);
		};
		
		// private
		// toggle checkboxes
		function toggleCheckbox (clickI) {
			if (obj.elements.checkboxes[clickI]) {
				if (obj.elements.checkboxes[clickI].attr('checked') == true) {
					checkCheckbox(clickI, false);
				} else {
					checkCheckbox(clickI, true);
				}		
			}
		};
		
		// private
		// checking checkbox
		function checkCheckbox(_indexClick, state) {
			var customAppr = obj.elements.checkboxes[_indexClick].custom;
			if (state == true) {
				customAppr.attr('class', settings.checkboxClassChecked);
				customAppr.attr('checked', true);
			}
			if (state == false) {
				customAppr.attr('class', settings.checkboxClass);
				customAppr.attr('checked', false);
			}
		};
		
		
		// private
		// toggle radio buttons
		function changeRadios (changeIndex) {
			for(var r = 0, rlen = obj.elements.radios.length; r < rlen; r++) {
				if(obj.elements.radios[r].attr('name') == obj.elements.radios[changeIndex].attr('name')) {
					obj.elements.radios[r]
						.attr('checked', false)
						.removeClass('checked');
				}
			}
			obj.elements.radios[changeIndex]
				.attr('checked', true)
				.addClass('checked');
			checkRadios(changeIndex);
		};
		
		// private
		// check radio buttons
		function checkRadios (checkIndex) {
			var customAppr = obj.elements.radios[checkIndex];
			for(var _r = 0, _rlen = obj.elements.radios.length; _r < _rlen; _r++) {
				if(obj.elements.radios[_r].custom || obj.elements.radios[_r].custom != 'undefined') {
					if((obj.elements.radios[_r].custom.hasClass(settings.radioClassChecked)) && obj.elements.radios[_r].attr('name') == customAppr.attr('name')) {
						obj.elements.radios[_r].custom.attr('class', settings.radioClass);
					}
				}
			}
			customAppr.custom.attr('class', settings.radioClassChecked);
		};
		
		// public
		// replace input[type=radio]'s
		obj.customizeRadios = function() {
			for(i=0, iln = obj.elements.radios.length; i<iln; i++) {
				if(!obj.elements.radios[i].hasClass(settings.customizedClass)) {
					obj.elements.radios[i].addClass(settings.customizedClass);
					var replacedInputRadio = $('<div></div>');
					if(obj.elements.radios[i].attr('checked') == true) {
						replacedInputRadio.addClass(settings.radioClassChecked);
					} else {
						replacedInputRadio.addClass(settings.radioClass);
					}
					replacedInputRadio.attr('customRadioId', 'customRadio' + i);
					obj.elements.radios[i].parent().prepend(replacedInputRadio);
					obj.elements.radios[i].custom = replacedInputRadio;
					
					// click custom radio input
					replacedInputRadio.click(function () {
						var _clickIndex = $(this).attr('customRadioId').replace('customRadio', '');
						changeRadios(_clickIndex, obj.elements, settings.radioClass, settings.radioClassChecked);
					});
				}
			}
			for (i=0, ilen = obj.elements.radioLabels.length; i<ilen; i++) {
				var _forAttr = obj.elements.radioLabels[i].attr('for');
				if (_forAttr && $('#' + _forAttr).length) {
					if (obj.elements.radioLabels[i].attr('targetId')) {
						obj.elements.radioLabels[i].click(function () {
							checkRadios($(this).attr('targetId'), obj.elements, settings.radioClass, settings.radioClassChecked);
						});
					}
				}
			}
		};
		
		// private
		// show custom select options
		function showOptions(selectId) {
			var _customSelect = obj.elements.selects[selectId].customSelect;
			var _customSelectHeight = _customSelect.outerHeight();
			if(settings.selectHeight) {
				_customSelectHeight = settings.selectHeight;
			}
			var _customOptions = obj.elements.selects[selectId].optionz;
			if (_customOptions && _customSelect) {
				if(settings.flexibleSelects) {
					_customOptions.css({
						width: _customSelect.width()
					});
				}
				if (elem.openedSelect && elem.openedSelect != _customOptions) {
					elem.openedSelect
						.removeClass(settings.optionsHiddenClass)
						.addClass(settings.optionsClass)
						.css({
							height : 'auto'
						});
				}
				if(_customOptions.hasClass(settings.optionsHiddenClass)) {
					_customOptions.css({
						left: '-9999px',
						top: getTopPosition(_customSelect) + _customSelectHeight + 'px'
					});
					hideOptions();
					_customOptions
						.removeClass(settings.optionsHiddenClass)
						.addClass(settings.optionsClass)
						.css({
							left: getLeftPosition(_customSelect) + 'px'
						});
					_customSelect.addClass(settings.selectActiveClass);
					elem.openedSelect = _customOptions;
					
					$(document).click(function (e) {
						if ($(e.target).parents('div.' + settings.selectClass).length == 0 && $(e.target).parents('div.' + settings.optionsClass).length == 0) {
							hideOptions();
						}
					});
				} else if(_customOptions.hasClass(settings.optionsClass)) {
					_customOptions
						.css({
							height : 'auto'
						})
						.removeClass(settings.optionsClass)
						.addClass(settings.optionsHiddenClass);
					hideOptions(); //hide
				}
			}
		};
		
		// private
		// hide custom select options
		function hideOptions() {
			if(elem.openedSelect){
				$('.' + settings.optionsClass).each(function(){
					$(this)
						.removeClass(settings.optionsClass)
						.addClass(settings.optionsHiddenClass);
				});
				$('.' + settings.selectActiveClass).each(function(){
					$(this).removeClass(settings.selectActiveClass);
				});
				elem.openedSelect = false;
			}
		};
		
		// private
		// custom selects event
		function customSelectEvent(_optionId, _selectIndex) {
			var customAppr = obj.elements.selects[_selectIndex];
			$('option', customAppr).each(function(optionId) {
				if(optionId == _optionId) {
					$(this).attr('selected', true);
				} else {
					$(this).attr('selected', false);
				}
			});
			var _customSelectTextNew = $('option', customAppr).eq(_optionId).text();
			customAppr.customSelect.find('.bg-select-center').text(_customSelectTextNew);
			if (customAppr.change && obj.selectsAll) {
				eval(customAppr.change());
			}
			hideOptions();
		};
		
		// public
		// live selects update
		obj.updateSelect = function(selectObject) {
			var updateSelectId = selectObject.attr('defaultselectid').replace('defaultSelect', '');
			var replacedOptions = settings.selectOptionHTML;
			var replacedOptionsItems = '';
			var customSelectBoxDefault = selectObject.find('option').eq(0).text();
			selectObject.find('option').each(function (j) {
				var _oHTML = {
					optionItem : $(this).html()
				};
				replacedOptionsItems += settings.selectOptionItem.supplantstr(_oHTML);
				var _attrSelected = $(this).attr('selected');
				if(_attrSelected) {
					customSelectBoxDefault = selectObject.find('option').eq(j).text();
				}
			});
			var customSelectDropdown = selectObject.data('dOptions');
			var customSelectDropdownUl = $('ul', customSelectDropdown);
			if(customSelectDropdownUl.length) {
				customSelectDropdownUl.html(replacedOptionsItems);
				$('a', customSelectDropdownUl).each(function (j) {
					$(this)
						.attr('rel', j)
						.attr('class', updateSelectId);
				});
			}
			var customSelectBox = selectObject.data('dCustomSelect');
			var customSelectBoxText = $('.bg-select-center', customSelectBox);
			customSelectBoxText.html(customSelectBoxDefault);
		};
		
		// public
		// replace selects
		obj.customizeSelects = function() {
			// set string supplant method if undefined
			if(typeof String.prototype.supplantstr != 'function') {
				String.prototype.supplantstr = function (obj) {
					return this.replace(/{([^{}]*)}/g,
					function(a, b) {
						var r = obj[b];
						return typeof r === 'string' || typeof r === 'number' ? r : a;
					});
				};
			}
			obj.selectsAll = false;
			elem.openedSelect = false;
			for (i=0; i<obj.elements.selects.length; i++) {
				if (!obj.elements.selects[i].hasClass(settings.customizedClass)) {
					obj.elements.selects[i].index = i;
					var _selectWidth = parseInt(obj.elements.selects[i].width());
					var _defaultTxt = '';
					obj.elements.selects[i].find('option').each(function () {
						if ($(this).attr('selected')) {
							_defaultTxt = $(this).html();
						}
					});
					if (_defaultTxt=='') _defaultTxt = obj.elements.selects[i].find('option').eq(0).text();
					var replacedSelect = $('\
					<div class="' + settings.selectClass + '">\
					    <div class="bg-select-left"></div>\
					    <div class="disabled"></div>\
					    <div class="bg-select-center" customselecttext="customSelectText' + i + '">' + _defaultTxt + '</div>\
					    <a href="#" rel="' + i + '" class="selectButton"></a>\
					</div>');
					replacedSelect.addClass(obj.elements.selects[i].attr('class'));
					if(obj.elements.selects[i].attr('disabled')) {
						replacedSelect.addClass(settings.selectDisabledClass);
					}
					obj.elements.selects[i].parent().prepend(replacedSelect);
					// click select
					$('a', replacedSelect).click(function () {
						var _id = $(this).attr('rel');
						if (_id && parseInt(_id)==_id) {
							showOptions(_id);
						}
						return false;
					});
					var _leftWidth = parseInt(replacedSelect.find('.bg-select-left').width());
					var _rightWidth = parseInt(replacedSelect.find('.bg-select-center').css('marginRight'));
					if(settings.flexibleSelects) {
						replacedSelect.css({
							width: '100%'
						});
					} else {
						replacedSelect.css({
							width : _selectWidth + _leftWidth + _rightWidth
						});
					}
					replacedSelect.attr('customSelectId', 'customSelect' + i);
					$(obj.elements.selects[i]).attr('defaultSelectId', 'defaultSelect' + i);
					var replacedOptions = settings.selectOptionHTML;
					var replacedOptionsItems = '';
					obj.elements.selects[i].find('option').each(function (j) {
						var _oHTML = {
							optionItem : $(this).html()
						};
						replacedOptionsItems += settings.selectOptionItem.supplantstr(_oHTML);
					});
					var _sHTML = {
						options : replacedOptionsItems
					};
					replacedOptions = replacedOptions.supplantstr(_sHTML);
					replacedOptions = $(replacedOptions);
					replacedOptions
						.css({
							width : replacedSelect.width()
						})
						.attr('customOptionsId', 'customOptions' + i);
					replacedOptions.click(function(e) {
						var _optionsTarget = $(e.target);
						if(_optionsTarget.is('a')) {
							var _j = _optionsTarget.attr('rel');
							var _i = _optionsTarget.attr('class');
							if (_j && _i) {
								showOptions(_i);
								customSelectEvent(_j, _i);
							}
							return false;
						} else {
							return true;
						}
					});
					$('a', replacedOptions).each(function (j) {
						$(this)
							.attr('rel', j)
							.attr('class', i);
					});
					obj.elements.selects[i].customSelect = replacedSelect;
					obj.elements.selects[i].optionz = replacedOptions;
					obj.elements.selects[i].data({
						dCustomSelect: replacedSelect,
						dOptions: replacedOptions
					});
					replacedOptions.addClass(obj.elements.selects[i].attr('class'));
					replacedOptions.select = obj.elements.selects[i];
					$('body').append(replacedOptions);
					obj.elements.selects[i].addClass(settings.customizedClass);
					replacedOptions.addClass(settings.optionsHiddenClass);
				}
			}
			obj.selectsAll = true;
			if(settings.selectImplemented && jQuery.isFunction(settings.selectImplemented)) {
				settings.selectImplemented.apply(this);
			}
			
			// hide select's dropdown on window resize
			if (settings.hideOnResize) {
				$(window).resize(function () {
					$('.' + settings.optionsClass).each(function () {
						$(this)
							.removeClass(settings.optionsClass)
							.addClass(settings.optionsHiddenClass);
					});
					$('.' + settings.selectActiveClass).each(function () {
						$(this).removeClass(settings.selectActiveClass);
					});
				});
			}
			
			// hide select's dropdown on window scroll
			if (settings.hideOnScroll) {
				$(window).scroll(function () {
					$('.' + settings.optionsClass).each(function () {
						$(this)
							.removeClass(settings.optionsClass)
							.addClass(settings.optionsHiddenClass);
					});
					$('.' + settings.selectActiveClass).each(function () {
						$(this).removeClass(settings.selectActiveClass);
					});
				});
			}
		};
		
		// private
		// get left position
		var getLeftPosition = function(selectObject) {
			var objectOffset = selectObject.offset();
			return objectOffset.left;
		};
		
		// private
		// get top position
		var getTopPosition = function(selectObject) {
			var objectOffset = selectObject.offset();
			return objectOffset.top;
		};
		
		// init
		obj.initialize();
	};
	$.fn.urForm = function(options) {
		return this.each(function() {
			var element = $(this);
			if (element.data('urForm')) return;
			var urForm = new UrForm(this, options);
			element.data('urForm', urForm);
		});
	};
})(jQuery);