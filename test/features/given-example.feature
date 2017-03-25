Feature: Supplied example problem.

  Scenario: Order 50; 4 vegetarian, 7 glutten free
    Given we wish to order 50 meals including restricted meals:
      | vegetarian  | 5 |
      | gluten free | 7 |
    And restaurant "A" has a rating of 5 and can serve a total of 40 meals including restricted meals:
      | vegetarian | 4 |
    And restaurant "B" has a rating of 3 and can serve a total of 100 meals including restricted meals:
      | vegetarian  | 20 |
      | gluten free | 20 |
    When we use the automated-orders app to determine the best possible orders
    Then we expect to order from restaurant "A" 36 unrestricted meals and the following restricted meals:
      | vegetarian | 4 |
    And we expect to order from restaurant "B" 2 unrestricted meals and the following restricted meals:
      | vegetarian  | 1 |
      | gluten free | 7 |
    And we expect no orders to be unsatisfied
    And restaurant "A" has no meals left
    And restaurant "B" has 90 meals left with the following restricted meals:
      | vegetarian  | 19 |
      | gluten free | 13 |
