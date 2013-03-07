Feature: Manage departments
  In order to [goal]
  [stakeholder]
  wants [behaviour]
  
  Scenario: Register new department
    Given I am on the new department page
    When I fill in "Name" with "name 1"
    And I press "Create"
    Then I should see "name 1"

  Scenario: Delete department
    Given the following departments:
      |name|
      |name 1|
      |name 2|
      |name 3|
      |name 4|
    When I delete the 3rd department
    Then I should see the following departments:
      |Name|
      |name 1|
      |name 2|
      |name 4|
