Feature: Manage Mails
  In order to Manage Office Documents
	As a regular user
	I want to send and received Office Documents
  When I save a document it is intended to be modified later
  but when I sent a document is going to be visible by the receiver
  therefore should not be editable
  
  Background:
    Given I create an user named "Jhon" and lastname "Michaels"
    And I logged in as "Jhon Michaels"
    Then I should see "Logged in!"
  
  Scenario: Save a new memo
    Given I create an user named "Richard" and lastname "Jhonson"
    And I create a department named "Purchasing" for "Richard Jhonson"
    And I am on the new mails page
    When I fill in "Subject" with "Important Memo!"
    And I fill in "Body" with "We'll have a meeting tomorrow at 9:30 a.m."
    And I select "Inner Mail" from "mailing_sent_type"
    And I select "Richard Jhonson" from "mailing_receiver_id"
    And I press "Save"
    When I am on the unsent documents page
    And I should see "Important Memo!"
    And I should see "Saved"

  Scenario: Send a new memo
    Given I create an user named "Bob" and lastname "Doe"
    And I create a department named "Sales and Marketing" for "Bob Doe"
    And I am on the new mails page
    When I fill in "Subject" with "Urgent Memo!"
    And I fill in "Body" with "We need to meet right now!"
    And I select "Bob Doe" from "mailing_receiver_id"
    And I select "Outer Mail" from "mailing_sent_type"
    And I press "Send"
    Then I should see "Urgent Memo!"
    And I should see "Sent"
    And I should not see "Edit"
    And I should not see "Delete"

  Scenario: Should not save a send document in any way, even when
            the user get to the edit page by the url address bar, 
            it doesn't save, staying in the edit page
    Given I create a Memo
    Then I am on the edit Memo page with number "00001"
    And I press "Send"
    When I am on the edit Memo page with number "00001"
    And I press "Save"
    Then I am on the edit Memo page with number "00001"

  Scenario: Search by recipient
    Given I create an user named "Bob" and lastname "Doe"
    And I create a department named "Sales and Marketing" for "Bob Doe"
    And I create an user named "Richard" and lastname "Jhonson"
    And I create a department named "Purchasing" for "Richard Jhonson"
    Then I am on the new mails page
    And I fill in "Subject" with "Urgent Memo for Bob Doe!"
    And I select "Bob Doe" from "mailing_receiver_id"
    And I press "Send"
    Then I am on the new mails page
    And I fill in "Subject" with "Urgent Memo for Richard Jhonson!"
    And I select "Richard Jhonson" from "mailing_receiver_id"
    And I press "Send"
    Then I should see "Urgent Memo for Bob Doe!"
    And I should see "Urgent Memo for Richard Jhonson!"
    When I fill in "search" with "Bob Doe"
    And I press "Search"
    Then I should see "Urgent Memo for Bob Doe!"
    And I should not see "Urgent Memo for Richard Jhonson!"
