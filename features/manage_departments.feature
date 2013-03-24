Feature: Manage departments
  In order to Manage Departments
	As a regular user
	I want to see default behaviour

  Background:
    Given I create an user named "Jhon" and lastname "Michaels"
    And I logged in as "Jhon Michaels"
    Then I should see "Logged in!"
  
  Scenario: Register new department
    Given I am on the new department page
    When I fill in "Name" with "Accounting"
    And I press "Create Department"
    Then I should see "Accounting"

  Scenario: Delete department
    Given the following departments:
      |name|
      |Accounting     |
      |Human Resources|
      |IT Department  |
      |Purchasing     |
    When I delete the 3rd department
    Then I should see the following departments:
      |Name|
      |Accounting     |
      |Human Resources|
      |IT Department  |
