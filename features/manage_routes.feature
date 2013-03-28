Feature: Manage routes 
  In order to secure a sender and a receiver
  As a regular user
  I want to see a receiver for the document
  
  Background:
    Given I create an user named "Jhon" and lastname "Michaels"
    And I logged in as "Jhon Michaels"
    Then I should see "Logged in!"

  Scenario: check the receiver in Sent Documents and
            the doc in sent path
    Given I create an user named "Bob" and lastname "Doe"
    And I create a department named "Accounting" for "Bob Doe"
    And I create an user named "Peter" and lastname "Michaels"
    And I create a department named "Production" for "Peter Michaels"
    Then I am on the new mails page
    When I fill in "Subject" with "Important Memo!"
    And I select "Bob Doe" from "mailing_receiver_id"
    And I select "Peter Michaels" from "mailing_receiver_id"
    And I press "Send"
    Then I should be on the sent documents page
    And I should see "Bob Doe, from: Accounting; Peter Michaels, from: Production"

  Scenario: check the document sent in inbox's receiver
    Given I create an user named "Bob" and lastname "Doe"
    And I create a department named "Human Resources" for "Bob Doe"
    Then I am on the new mails page
    When I fill in "Subject" with "Important Memo!"
    And I select "Bob Doe" from "mailing_receiver_id"
    And I press "Send"
    Then I logged out
    When I logged in as "Bob Doe"
    Then I should see "Logged in!"
    And I should see "Bob Doe"
    And I should see "Human Resources"
    Then I am on the inbox documents page
    And I should see "Important Memo!"
