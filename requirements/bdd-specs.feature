# Comment
@tag
Feature: List all symbols
  As a user
  I want to see all symbols
  So that I decide what symbol to show

  Scenario: User has internet connection
    Given user has internet connection
    When user requires all symbols
    Then application fetch all symbols from API

  Scenario: User has no internet connection
    Given user has no internet connection
    And has symbols stored in cache
    And data is more recent than 3 days
    When user requires all symbols
    Then application show symbols stored in cache

  Scenario: User has no internet connection
    Given user has no internet connection
    And has symbols stored in cache
    And data is not more recent than 3 days
    When user requires all symbols
    Then application display error

  Scenario: User has no internet connection
    Given user has no internet connection
    And has no symbols stored in cache
    When user required all symbols
    Then application display error
