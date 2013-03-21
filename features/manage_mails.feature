Feature: Manage Mails
  In order to Manage Office Mails
	As a regular user
	I want to send and received Office Mails
  
  Scenario: Create a new memo
    Given I am on the new mails page
    When I fill in "Subject" with "Important Memo!"
    And I select "Memo" from "Types"
    And I fill in "Body" with "We'll have a meeting tomorrow at 9:30 a.m."
    And I select "Inner" from "Destination"
    And I press "Save Mail"
    Then I should see "Important Memo!"
