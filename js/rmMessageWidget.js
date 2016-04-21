$.widget('oa.remindermessage', {
    options: {
        count: 60,
        wordList: [{
                value: 'Patient First Name',
                abr: 'Pat. First Name',
                template: '{PatientFirstName}',
                name: 'patFirstName'
            }, {
                value: 'Patient Last Name',
                abr: 'Pat. Last Name',
                template: '{PatientLastName}',
                name: 'patLastName'
            }, {
                value: 'Provider First Name',
                abr: 'Pro. First Name',
                template: '{ProviderFirstName}',
                name: 'proFirstName'
            }, {
                value: 'Provider Last Name',
                abr: 'Pro. First Name',
                template: '{ProviderLastName}',
                name: 'proLastName'
            }, {
                value: 'Appointment Date',
                abr: 'App. Date',
                template: '{AppDate}',
                name: 'appDate'
            }, {
                value: 'Appointment Time',
                abr: 'App. Time',
                template: '{AppTime}',
                name: 'appTime'
            }, {
                value: 'Office Name',
                abr: 'Office Name',
                template: '{OfficeName}',
                name: 'oName'
            }
        ],
        parseTemplateStrings: {
            'patFirstName': function() {
                return '<input type="button" class="clearable btn btn-default btn-xs" name="patFirstName" contenteditable="false" readonly value="&#xf00d; Patient First Name" />';
            },
            'patLastName': function() {
                return '<input type="button" class="clearable btn btn-default btn-xs" name="patLastName" contenteditable="false" readonly value="&#xf00d; Patient Last Name" />';
            },
            'proFirstName': function() {
                return '<input type="button" class="clearable btn btn-default btn-xs" name="proFirstName" contenteditable="false" readonly value="&#xf00d; Provider First Name" />';
            },
            'proLastName': function() {
                return '<input type="button" class="clearable btn btn-default btn-xs" name="proLastName" contenteditable="false" readonly value="&#xf00d; Provider Last Name" />';
            },
            'appDate': function() {
                return '<input type="button" class="clearable btn btn-default btn-xs" name="appDate" contenteditable="false" readonly value="&#xf00d; Appointment Date" />';
            },
            'appTime': function() {
                return '<input type="button" class="clearable btn btn-default btn-xs" name="appTime" contenteditable="false" readonly value="&#xf00d; Appointment Time" />';
            },
            'oName': function() {
                return '<input type="button" class="clearable btn btn-default btn-xs" name="oName" contenteditable="false" readonly value="&#xf00d; Office Name" />';
            }
        },
        templateStrings: {
            'patFirstName': function() {
                return '{PatientFirstName}';
            },
            'patLastName': function() {
                return '{PatientLastName}';
            },
            'proFirstName': function() {
                return '{ProviderFirstName}';
            },
            'proLastName': function() {
                return '{ProviderLastName}';
            },
            'appDate': function() {
                return '{AppDate}';
            },
            'appTime': function() {
                return '{AppTime}';
            },
            'oName': function() {
                return '{OfficeName}';
            }
        },
        templates: ['patFirstName', 'patLastName', 'proFirstName', 'proLastName', 'appDate', 'appTime', 'oName'],
        msgs: {
            required: 'Message Control is required.  Please correct and try again.',
            invalid: 'Message Control is invalid.  Please correct and try again.',
            noTemplate: 'No templates were selected.  Please correct and try again.'
        }
    },
    _create: function() {
        var div = $('<div>', { 'class': 'panel panel-default messageControl', style: 'border: none;'});
        this.element.wrap(div);
        this.divWordList = this._createWordList();
        this.divWordList.prependTo(this.element.parent());

        // Add char counter
        this.element.parent().append(this._createCharCounter());

        this._on(this.element.parent(), {
            'click.clearable': function(e) {
                this._clearable(e);
                this.element.trigger('change');
            }
        });

        this._on(this.element, {
            keyup: function(e) {
                this.updateCount(e);
                this.checkTemplates(e);
                this.validate(true);
            },
            keydown: function(e) {
                this._keyblock(e);
                this.validate(true);
                this.element.trigger('change');
            },
            paste: function(e) {
                this._dontAllowInput(e);
                this.updateCount(e);
                this.validate(true);
                this.element.trigger('change');
            }
        });
        
        function controlselectHandler(evt) {
            evt.preventDefault();
        }
        document.body.addEventListener('mscontrolselect', controlselectHandler);

        this._render();
    },
    _valid: true,
    _dontAllowInput: function(e) {
        e.stopPropagation();
        e.preventDefault();
        return false;
    },
    _keyblock: function(e) {
        var key;
        // Test for backspace or delete
        if(typeof event !== 'undefined') {
            key = event.keyCode || event.charCode;           
        }
        
        var isNotBackspaceOrDelete = (key === 8 || key === 46) ? false : true;
        
        var isNotArrowKeys = (key === 37 || key === 38 || key === 39 || key === 40) ? false : true;
        
        //Dont allow curly braces since they are used for templates
        if (key === 221 || key === 219) {
            e.stopPropagation();
            e.preventDefault();
            return false;
        }

        // allow backspace or delete when at character limit
        if (this.element.text().length >= this.options.count && isNotBackspaceOrDelete && isNotArrowKeys) {
            e.stopPropagation();
            e.preventDefault();
            return false;
        }

    },
    checkTemplates: function(e) {
        var htmlButtons = this.element.find('input');

        var wordList = this.element.parent().find('.rm-wordList');
        var buttonTemplates = wordList.find('button');

        // Enable buttons and unhiding buttons
        $.each(buttonTemplates, function(index, item) {
            $(item).attr('disabled', false).removeClass('hidden');
        });

        // Disable and hide options that are parsed
        $.each(htmlButtons, function(index, item) {
            var name = $(item).attr('name');
            var templates = this.options.templates;
            var templateItem = $.inArray(name, templates);
            if (templateItem > -1) {
                buttonTemplates.filter('button[name=' + templates[templateItem] + ']').attr('disabled', true).addClass('hidden');
            }
        }.bind(this));

    },
    _createCharCounter: function() {
        var span = $('<span>', {
            style: 'display: block; text-align: left;',
            'class': 'h6',
            html: '<span>' + this.charUsed() + '</span>' + ' / ' + this.options.count + ' characters'
        });

        return span;
    },
    charUsed: function() {
        return this.element.text().length;
    },
    updateCount: function(e) {        
        this.element.siblings('span').children('span').text(this.charUsed());
    },
    validate: function(internal) {
        var outputMsg = [];
        this.element.parent('div').removeClass('ui-state-error');
        
        if (this.element.text().length > this.options.count) {
            this._valid = false;
            this.element.parent('div').addClass('ui-state-error');
            outputMsg.push(this.options.msgs.invalid);
        } else {
            this._valid = true;
        }
        
        if(this.element.text().length < 1) {
            if(!internal) {
                this.element.parent('div').addClass('ui-state-error');   
                this._valid = false;
                outputMsg.push(this.options.msgs.required);             
            }
        }
        
        if(this.element.children().length < 1) {
            if(!internal) {
                this.element.parent('div').addClass('ui-state-error');
                outputMsg.push(this.options.msgs.noTemplate);
                this._valid = false;               
            }
            
        }    
        
        return {
            valid: this._valid,
            messages: outputMsg
        };
    },
    _setOptions: function(key, value) {
        $.Widget.prototype._setOptions.call(this, key, value);
        this._super(key, value);
        this._render();
    },
    _render: function() {
        this.parseTemplateString();
        this.updateCount();
    },
    _clearable: function(event) {
        var name = $(event.target).attr('name');
        this.toggleOption(false, name);
        $(event.target).remove();
    },
    parseTemplateString: function() {
        var html = this.element.html();
        var pTempString = this.options.parseTemplateStrings;

        // Disable options that are parsed
        $.each(this.options.wordList, function(index, item) {
            if (html.indexOf(item.template) > -1) {
                this.toggleOption(true, item.name);
            }
        }.bind(this));

        var htmlParsed = html
            .replace('{PatientFirstName}', pTempString['patFirstName']())
            .replace('{PatientLastName}', pTempString['patLastName']())
            .replace('{ProviderFirstName}', pTempString['proFirstName']())
            .replace('{ProviderLastName}', pTempString['proLastName']())
            .replace('{AppDate}', pTempString['appDate']())
            .replace('{AppTime}', pTempString['appTime']())
            .replace('{OfficeName}', pTempString['oName']());
        
        // remove duplicate templates from the message
        htmlParsed = htmlParsed
            .replaceAll('{PatientFirstName}', '')
            .replaceAll('{PatientLastName}', '')
            .replaceAll('{ProviderFirstName}', '')
            .replaceAll('{ProviderLastName}', '')
            .replaceAll('{AppDate}', '')
            .replaceAll('{AppTime}', '')
            .replaceAll('{OfficeName}', '');

        this.element.html(htmlParsed);
    },
    createTemplateString: function() {
        var selfElement = this.element.clone();

        var children = selfElement.children();
        $.each(children, function(index, item) {
            $(item).replaceWith(this.options.templateStrings[$(item).attr('name')]);
        }.bind(this));

        var html = selfElement.html();
        html = html.replaceAll('&nbsp;', ' ');

        return html;
    },
    _createWordList: function() {
        var $div = $('<div>', {
            style: 'display:inline-block; width:100%; border: 1px solid #ddd;',
            'class': 'panel-heading'
        });

        $div.append('<div class=\"rm-wordList\" role=group aria-label=...></div>');

        $.each(this.options.wordList, function(index, item) {
            var button = $('<button>', {
                text: item.value,
                name: item.name,
                title: item.value,
                'class': 'btn btn-default btn-sm rm-buttonList'
            });
            
            button.prepend('<i class="fa fa-plus" aria-hidden="true" style="color: green;"></i> ');

            this._on(button, {
                click: function(e) {
                    e.preventDefault();
                    this.insertNode(e);
                }
            });

            $div
                .find('.rm-wordList')
                .append(button);
        }.bind(this));

        return $div;
    },
    _createMessageBox: function() {
        var div = $('<div>', {
            style: 'display:inline-block',
            'class': 'rm-messagebox',
            contenteditable: true
        });

        return div;
    },
    insertNode: function(event) {
        if (this._checkIfAttrExists($(event.target).attr('name'))) {
            if (console)
                console.log('attr already exists');
        } else {
            var name = $(event.target).attr('name');
            var text = $(event.target).attr('title');
            this.toggleOption(true, name);
            this.element.focus();
            this._pasteHtmlAtCaret('<input name=' + name + ' type=button class=\"clearable btn btn-default btn-xs\" value="&#xf00d; ' + text + '" /> ');
            this.element.trigger('change');
            this.updateCount();
        }
    },
    toggleOption: function(isEnabled, name) {
        var wordList = this.element.parent().find('.rm-wordList');
        var word = wordList.find('button[name=' + name + ']');
        word.attr('disabled', isEnabled);
        // hide buttons that are disabled
        if(isEnabled){
            word.addClass('hidden');
        } else {
            word.removeClass('hidden');
        }
    },
    _checkIfAttrExists: function(name) {
        if (this.element.find('[name=' + name + ']').length) {
            return true;
        } else {
            return false;
        }
    },
    _pasteHtmlAtCaret: function(html) {
        var sel, range;
        if (window.getSelection) {
            // IE9 and non-IE
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();

                // Range.createContextualFragment() would be useful here but is
                // non-standard and not supported in all browsers (IE9, for one)
                var el = document.createElement('div');
                el.innerHTML = html;
                var frag = document.createDocumentFragment(),
                    node, lastNode;
                while ((node = el.firstChild)) {
                    lastNode = frag.appendChild(node);
                }
                range.insertNode(frag);

                // Preserve the selection
                if (lastNode) {
                    range = range.cloneRange();
                    range.setStartAfter(lastNode);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        } else if (document.selection && document.selection.type !== 'Control') {
            // IE < 9
            document.selection.createRange().pasteHTML(html);
        }
    },
    destroy: function() {
        this.element.html('');
        this.element.prev().remove();
        this.element.siblings('span').remove();      
    }

});


String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
