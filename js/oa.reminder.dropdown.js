/**
 * Language Dropdown Widget for Reminder Mate
 */

$.widget('oa.reminderDropdown', {
    options: {
        ddlOptions: null,
        selectedOption: ""
    },
    _create: function () {
        this._preRender();

        this._on(this.element, {
            change: function (e) {
                if (false === this._trigger("onChange", this, [e])) {
                    return;
                }
            }
        });
        this._loadOptions();
    },
    _preRender: function () {
        if(!$.isArray(this.options.ddlOptions)){
            throw new Error("ddlOptions must be an array");
        }
    },
    _loadOptions: function() {
        this.element.find('option').remove();  
        var options = this.options.ddlOptions;
        $.each(options, function (i, item) {
            var opt = $('<option>', { value: item.Code, text: item.Description });
            this.element.append(opt);
        }.bind(this));

        if (this.options.selectedOption) {
            this.element.find('option[value="' + this.options.selectedOption + '"]').attr('selected', true);
            this.element.trigger('change');
        }
    },
    _destroy: function() {
        this.element.find('option').remove();   
    },
    addOption: function(opt) {
        this.options.ddlOptions = this.options.ddlOptions.concat([opt]);

        if(opt.hasOwnProperty("Code")){
            this.options.selectedOption = opt.Code;
        }
        this._loadOptions();
    },
    removeOption: function(code) {
        this.options.ddlOptions = this.options.ddlOptions.filter(function(item) {
            return item.Code !== code;
        });
        this._loadOptions();
    },
    getOptions: function() {
        return this.options.ddlOptions;
    }

});