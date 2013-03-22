Feature: Manage types
  In order to Manage Types
	As a regular user
	I want to see default behaviour
  
  Background:
    Given I am an authorized user
    Then I should see "Logged in!"
  
  Scenario: Register new type
    Given I am on the new type page
    When I fill in "Name" with "Memo"
    And I press "Create Type"
    Then I should see "Memo"

  Scenario: Delete type
    Given the following types:
      |name|
      |Memo      |
      |Letter    |
      |Document  |
      |Envelop   |
    When I delete the 3rd type
    Then I should see the following types:
      |Name|
      |Memo     |
      |Letter   |
      |Document |
