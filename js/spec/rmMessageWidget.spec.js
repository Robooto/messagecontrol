describe("Message Control", function() {

  
  beforeAll(function () {    
      $('#fixture').remindermessage({
          count: 15
      });
  });
  
  afterAll(function () {
      $('#fixture').remindermessage('destroy');
      $('#fixture').hide();
  });
  
  it('Message Control is created successfully', function() {
    expect($('#fixture').parent().find('.rm-wordList').length).toEqual(1);
    expect($('#fixture').next('span').length).toEqual(1);
  });
  
  describe("Parse Template Tests", function() {
      it('Parse 1 template into a button', function() {
          $('#fixture').html('Test {ProviderLastName}');
          $('#fixture').remindermessage('parseTemplateString');
          
          expect($('#fixture').find('input[type="button"]').length).toEqual(1);
      });
      
      it('Parse 3 templates into a buttons', function() {
          $('#fixture').html('Test {PatientFirstName} {PatientLastName} {ProviderLastName}');
          $('#fixture').remindermessage('parseTemplateString');
          
          expect($('#fixture').find('input[type="button"]').length).toEqual(3);
      });
      
      it('Parse templates into a buttons with repeat template', function() {
          $('#fixture').html('Test {PatientFirstName} {PatientFirstName} {PatientLastName} {ProviderLastName}');
          $('#fixture').remindermessage('parseTemplateString');
          
          expect($('#fixture').find('input[type="button"]').length).toEqual(3);
          expect($('#fixture').text()).not.toMatch(/{PatientFirstName}/);
      });
  });
  
});