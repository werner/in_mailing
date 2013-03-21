Feature: Manage Mails
  In order to Manage Office Mails
	As a regular user
	I want to send and received Office Mails
  
  Scenario: Save a new memo
    Given I create a Type
    Then I am on the new mails page
    When I fill in "Subject" with "Important Memo!"
    And I fill in "Number" with "Memo00001"
    And I select "Memo" from "mailing_type_id"
    And I fill in "Body" with "We'll have a meeting tomorrow at 9:30 a.m."
    And I select "Inner Mail" from "mailing_sent_type"
    And I press "Save"
    Then I should see "Important Memo!"
    And I should see "Saved"
