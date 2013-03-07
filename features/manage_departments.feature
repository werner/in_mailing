Feature: Manage departments
  In order to Manage Departments
	As a regular user
	I want to see default behaviour
  
  Scenario: Register new department
    Given I am on the new department page
    When I fill in "Name" with "Accounting"
    And I press "Save"
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
      |Purchasing     |
