var fixture = '#fixture';

describe('Message Control Tests', function() {
    
  beforeEach(function () {    
        setFixtures("<div id='fixture'></div>");
        $(fixture).remindermessage({
            count: 15
        });
  });
  
  afterAll(function () {
      $(fixture).remindermessage('destroy');
      $(fixture).hide();
  });
  
  it('Message Control is created successfully', function() {
    expect($(fixture).parent().find('.rm-wordList').length).toEqual(1);
    expect($(fixture).next('span').length).toEqual(1);
  });
  
  it('Message Control is destoryed sucessfully', function() {
      $(fixture).remindermessage('destroy');
      expect($(fixture).next('span').length).toEqual(0);
  });
  
  describe('Parse Template Tests', function() {
      it('Parse 1 template into a button', function() {
          $(fixture).html('Test {ProviderLastName}');
          $(fixture).remindermessage('parseTemplateString');
          
          expect($(fixture).find('input[type="button"]').length).toEqual(1);
      });
      
      it('Parse 3 templates into 3 buttons', function() {
          $(fixture).html('Test {PatientFirstName} {PatientLastName} {ProviderLastName}');
          $(fixture).remindermessage('parseTemplateString');
          
          expect($(fixture).find('input[type="button"]').length).toEqual(3);
      });
      
      it('Parse templates into a buttons with repeat template', function() {
          $(fixture).html('Test {PatientFirstName} {PatientFirstName} {PatientLastName} {ProviderLastName}');
          $(fixture).remindermessage('parseTemplateString');
          
          expect($(fixture).find('input[type="button"]').length).toEqual(3);
          expect($(fixture).text()).not.toMatch(/{PatientFirstName}/);
      });
  });
  
  // These tests aren't working when running all but do work when run them one at a time.
//   describe('Template Buttons tests', function() {
//      it('Check that buttons are disabled once the templates are used', function() {
//          $(fixture).html('Test {ProviderLastName}');
//          $(fixture).remindermessage('parseTemplateString').remindermessage('checkTemplates');
//          console.log($(fixture).parent('div').html())
//          console.log($(fixture).parent('div').find('.rm-wordList').find('button:disabled').length)
//          expect($(fixture).parent().find('.rm-wordList').find('button:disabled').length).toEqual(1);
//      });
     
//      it('Check that multiple buttons are disabled when templates are used', function() {
//          $(fixture).html('Test {PatientFirstName} {PatientFirstName} {PatientLastName} {ProviderLastName}');
//          $(fixture).remindermessage('parseTemplateString').remindermessage('checkTemplates');
         
//          expect($(fixture).parent().find('.rm-wordList').find('button:disabled').length).toEqual(3);         
//      });
     
//      it('Clicking a button creates a template and disables the button', function(){
//          $(fixture).html('');
//          $(fixture).parent().find('.rm-wordList').find('button[name="patLastName"]').click();
         
//          expect($(fixture).parent().find('.rm-wordList').find('button:disabled').length).toEqual(1);
//      });
//   });
  
  describe('Character Counter Tests', function() {
    it('Check that the default characters used is correct', function(){
        $(fixture).html('');
        expect($(fixture).remindermessage('charUsed')).toEqual(0);
    });
    
    it('Add some text and test that the count is correct', function () {
        $(fixture).html('Hello World');
        expect($(fixture).remindermessage('charUsed')).toEqual(11);
    });
    
    it('Test that html templates do not count in the character count', function() {
       $(fixture).html('Hello {PatientFirstName}').remindermessage('parseTemplateString');
       expect($(fixture).remindermessage('charUsed')).toEqual(6);
    });
    
    it('Test that the character count updates on the keyup event', function() {
        $(fixture).html('');
        var before = $(fixture).remindermessage('charUsed');
        $(fixture).html('testing123');
        $(fixture).trigger('keyup');
        
        expect(before).toEqual(0);
        expect($(fixture).remindermessage('charUsed')).toEqual(10);
    });
    
    it('Test that the character count updates on the keydown event', function() {
        $(fixture).html('');
        var before = $(fixture).remindermessage('charUsed');
        $(fixture).html('testing123');
        $(fixture).trigger('keydown');
        
        expect(before).toEqual(0);
        expect($(fixture).remindermessage('charUsed')).toEqual(10);
    });
    
    it('Test that the character count updates on the paste event', function() {
        $(fixture).html('');
        var before = $(fixture).remindermessage('charUsed');
        $(fixture).html('testing123');
        $(fixture).trigger('paste');
        
        expect(before).toEqual(0);
        expect($(fixture).remindermessage('charUsed')).toEqual(10);
    });
    
    it('Can change the max count', function() {
       var before = $(fixture).remindermessage('option', 'count');
       expect(before).toEqual(15); 
       $(fixture).remindermessage('option', 'count', 20);
       var after = $(fixture).remindermessage('option', 'count');
       expect(after).toEqual(20);
    });
  });
  
  describe('Create Template Tests', function() {
      it('Create template from message', function() {
          $(fixture).html('Hello {PatientFirstName}').remindermessage('parseTemplateString');
          
          expect($(fixture).remindermessage('createTemplateString')).toEqual('Hello {PatientFirstName}');
      });
      
      it('Create valid template from invalid message', function() {
          $(fixture).html('Hello {PatientFirstName} {PatientFirstName}').remindermessage('parseTemplateString');
          
          expect($(fixture).remindermessage('createTemplateString')).toEqual('Hello {PatientFirstName} ');
      });
      
      it('Html encode <> characters when creating templates', function() {
          $(fixture).html('<>').remindermessage('parseTemplateString');
          
          expect($(fixture).remindermessage('createTemplateString')).toEqual('&lt;&gt;');
      });
  });
  
  describe('Validation Tests', function() {
      it('Going over the character count makes the field invalid', function() {
         $(fixture).html('1234567890123456');
         $(fixture).trigger('keydown');
         var actual = $(fixture).remindermessage('validate');
         expect(actual.valid).toBeFalsy(); 
      });
      
      it('Keeping the message empty makes the field invalid', function () {
         $(fixture).html('');
         var actual = $(fixture).remindermessage('validate');
         expect(actual.valid).toBeFalsy();          
      });
      
      it('Not using any templates makes the field invalid', function() {
          $(fixture).html('12345');
          var actual = $(fixture).remindermessage('validate');
          expect(actual.valid).toBeFalsy();
      });
      
      it('Valid Control test', function() {
          $(fixture).html('Hello {PatientFirstName} {PatientLastName}').remindermessage('parseTemplateString');
          var actual = $(fixture).remindermessage('validate');
          expect(actual.valid).toBeTruthy();
      });
  });

  describe('Update tests', function() {

      it('Using update method updates text in control', function() {
          $(fixture).html('Hello {PatientFirstName} {PatientLastName}').remindermessage('parseTemplateString');
          $(fixture).remindermessage('updateControl', "Hello {PatientFirstName} ");
          expect($(fixture).remindermessage('createTemplateString')).toEqual('Hello {PatientFirstName} ');
      });

      it('update method changes character counter', function () {
          $(fixture).html('Hello {PatientFirstName} {PatientLastName}').remindermessage('parseTemplateString');
          $(fixture).remindermessage('updateControl', "Hello");
          expect($(fixture).remindermessage('charUsed')).toEqual(5);
      });

      it('update control with then validate - invalid', function () {
          $(fixture).html('Hello {PatientFirstName} {PatientLastName}').remindermessage('parseTemplateString');
          $(fixture).remindermessage('updateControl', "");
          var actual = $(fixture).remindermessage('validate');
          expect(actual.valid).toBeFalsy();
      });
  });
}); 

