var ddFixture = "#dropdownfixture";
var defaultOptions = [{
    "ID": 15,
    "Code": "EN",
    "Description": "English",
    "LanguageCode": "ENG"
}];

describe('Dropdown Control Tests', function () {

    beforeAll(function () {
        setFixtures("<select id='dropdownfixture'></select>");
    });

    afterAll(function () {
        $(ddFixture).hide();
    })

    describe('Create Tests', function() {
        afterEach(function() {
            $(ddFixture).reminderDropdown('destroy');
        });


        it('dropdown control is created successfully', function () {
            $(ddFixture).reminderDropdown({
                ddlOptions: defaultOptions
            });

            var actual = $(ddFixture).find('option');
            expect(actual.length).toEqual(1);
        });

        it('Creating dropdown with invalid option type', function () {
            expect(function() {$(ddFixture).reminderDropdown()}).toThrow();
        });

        it('Selects the correct default option', function() {
            $(ddFixture).reminderDropdown({
                ddlOptions: defaultOptions.concat([{
                    "ID": 9,
                    "Code": "ZH",
                    "Description": "Chinese",
                    "LanguageCode": "ZHO"
                }]),
                selectedOption: "ZH"
            });
            expect($(ddFixture).val()).toEqual("ZH");
        });

    });

    describe('Destory Test', function() {
        it('Dropdown control is destoryed successfully', function () {
            $(ddFixture).reminderDropdown({
                ddlOptions: defaultOptions
            });
            $(ddFixture).reminderDropdown('destroy');
            var actual = $(ddFixture).find('option');
            expect(actual.length).toEqual(0);
        });
    });

    describe('Dropdown functions', function() {

        afterEach(function() {
            $(ddFixture).reminderDropdown('destroy');
        });

        it('onChange is called on a change', function() {

            var methods = {
                changeIt: function(e) {}
            };

            spyOn(methods, 'changeIt');
            $(ddFixture).reminderDropdown({
                ddlOptions: defaultOptions,
                onChange: methods.changeIt
            });

            $(ddFixture).trigger('change');
            expect(methods.changeIt).toHaveBeenCalled();
        });


        it('add new option', function() {
            $(ddFixture).reminderDropdown({
                ddlOptions: defaultOptions
            });

            $(ddFixture).reminderDropdown("addOption", {
                "ID": 9,
                "Code": "ZH",
                "Description": "Chinese",
                "LanguageCode": "ZHO"
            });

            var actual = $(ddFixture).find('option');
            expect(actual.length).toEqual(2);

        });

        it('add new option and select it', function() {
            $(ddFixture).reminderDropdown({
                ddlOptions: defaultOptions
            });

            $(ddFixture).reminderDropdown("addOption", {
                "ID": 9,
                "Code": "ZH",
                "Description": "Chinese",
                "LanguageCode": "ZHO"
            });
            var actual = $(ddFixture).find('option');

            expect($(ddFixture).val()).toEqual("ZH");

        });

        it('remove option from list', function() {

            $(ddFixture).reminderDropdown({
                ddlOptions: defaultOptions.concat([{
                    "ID": 9,
                    "Code": "ZH",
                    "Description": "Chinese",
                    "LanguageCode": "ZHO"
                }]),
                defaultOption: "EN"
            });

            $(ddFixture).reminderDropdown("removeOption", "ZH");

            var actual = $(ddFixture).find('option');
            expect(actual.length).toEqual(1);
        });

        it('get list of current options', function() {
            $(ddFixture).reminderDropdown({
                ddlOptions: defaultOptions.concat([{
                    "ID": 9,
                    "Code": "ZH",
                    "Description": "Chinese",
                    "LanguageCode": "ZHO"
                }]),
                defaultOption: "EN"
            });

            var actual = $(ddFixture).reminderDropdown("getOptions");
            expect(actual.length).toEqual(2);
        })
    });

});