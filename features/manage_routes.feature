Feature: Manage routes 
  In order to secure a sender and a receiver
  As a regular user
  I want to see a receiver for the document
  
  Background:
    Given I am an authorized user
    Then I should see "Logged in!"

  Scenario: check the receiver
    Given I create a Type
    Given I create an user named "Bob" and lastname "Doe" and the "Accounting" department for the user
    Then I am on the new mails page
    When I fill in "Subject" with "Important Memo!"
    And I fill in "Number" with "Memo00001"
    And I select "Bob Doe" from "mailing_user_id"
    And I press "Send"
    Then I should see "Accounting"
    And I should see "Bob Doe"
