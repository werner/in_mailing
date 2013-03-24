Feature: Manage positions
  In order to Manage Positions
	As a regular user
	I want to see default behaviour
  
  Background:
    Given I create an user named "Jhon" and lastname "Michaels"
    And I logged in as "Jhon Michaels"
    Then I should see "Logged in!"
  
  Scenario: Register new position
    Given I am on the new position page
    When I fill in "Name" with "Manager"
    And I press "Create Position"
    Then I should see "Manager"

  Scenario: Delete position
    Given the following positions:
      |name|
      |Manager   |
      |Developer |
      |Secretary |
      |Office Boy|
    When I delete the 3rd position
    Then I should see the following positions:
      |Name|
      |Manager   |
      |Developer |
      |Secretary |
