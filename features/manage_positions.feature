Feature: Manage positions
  In order to Manage Positions
	As a regular user
	I want to see default behaviour
  
  Scenario: Register new position
    Given I am on the new position page
    When I fill in "Name" with "Manager"
    And I press "Save"
    Then I should see "Manager"

  Scenario: Delete department
    Given the following departments:
      |name|
      |Manager   |
      |Developer |
      |Secretary |
      |Office Boy|
    When I delete the 3rd department
    Then I should see the following departments:
      |Name|
      |Manager   |
      |Developer |
      |Office Boy|
