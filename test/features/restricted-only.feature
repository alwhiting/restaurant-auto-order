Feature: Ordering restricted meals only

  Scenario: Order 30 from a single restaurant that has enough capacity
    Given we wish to order 30 meals including restricted meals:
      | vegetarian  | 5 |
      | gluten free | 5 |
      | nut free    | 5 |
      | fish free   | 5 |
      | candy       | 7 |
      | cheese only | 3 |
    And restaurant "A" has a rating of 5 and can serve a total of 40 meals including restricted meals:
      | vegetarian  | 7 |
      | gluten free | 7 |
      | nut free    | 7 |
      | fish free   | 7 |
      | candy       | 7 |
      | cheese only | 5 |
    When we use the automated-orders app to determine the best possible orders
    Then we expect to order from restaurant "A" 0 unrestricted meals and the following restricted meals:
      | vegetarian  | 5 |
      | gluten free | 5 |
      | nut free    | 5 |
      | fish free   | 5 |
      | candy       | 7 |
      | cheese only | 3 |
    And we expect no orders to be unsatisfied
    And restaurant "A" has 10 meals left with the following restricted meals:
      | vegetarian  | 2 |
      | gluten free | 2 |
      | nut free    | 2 |
      | fish free   | 2 |
      | cheese only | 2 |

  Scenario: Order 30 from a single restaurant where we run out of restricted meals
    Given we wish to order 30 meals including restricted meals:
      | vegetarian  | 15 |
      | gluten free |  5 |
      | nut free    |  5 |
      | fish free   |  5 |
    And restaurant "A" has a rating of 5 and can serve a total of 25 meals including restricted meals:
      | vegetarian  | 20 |
      | gluten free |  2 |
      | nut free    |  2 |
      | fish free   |  1 |
    When we use the automated-orders app to determine the best possible orders
    Then we expect to order from restaurant "A" 0 unrestricted meals and the following restricted meals:
      | vegetarian  | 15 |
      | gluten free |  2 |
      | nut free    |  2 |
      | fish free   |  1 |
    And we expect 0 unrestricted meals are unsatisfied and the following restricted meals are unsatisfied:
      | vegetarian  | 0 |
      | gluten free | 3 |
      | nut free    | 3 |
      | fish free   | 4 |
    And restaurant "A" has 5 meals left

  Scenario: Order 30 from multiple restaurants
    Given we wish to order 30 meals including restricted meals:
      | vegetarian | 25 |
      | ice cream  |  4 |
      | meat only  |  1 |
    And restaurant "A" has a rating of 5 and can serve a total of 10 meals including restricted meals:
      | vegetarian  | 5 |
      | ice cream   | 2 |
    And restaurant "Meat Shack" has a rating of 1 and can serve a total of 1 meals including restricted meals:
      | meat only | 1 |
    And restaurant "Generic Chain 1" has a rating of 3 and can serve a total of 20 meals including restricted meals:
      | vegetarian | 10 |
    And restaurant "Generic Chain 2" has a rating of 2 and can serve a total of 30 meals including restricted meals:
      | vegetarian | 20 |
      | ice cream  | 10 |
    When we use the automated-orders app to determine the best possible orders
    Then we expect to order from restaurant "A" 0 unrestricted meals and the following restricted meals:
      | vegetarian | 5 |
      | ice cream  | 2 |
    And we expect to order from restaurant "Generic Chain 1" 0 unrestricted meals and the following restricted meals:
      | vegetarian | 10 |
    And we expect to order from restaurant "Generic Chain 2" 0 unrestricted meals and the following restricted meals:
      | vegetarian | 10 |
      | ice cream  |  2 |
    And we expect to order from restaurant "Meat Shack" 0 unrestricted meals and the following restricted meals:
      | meat only | 1 |
    And we expect no orders to be unsatisfied
    And restaurant "A" has 3 meals left with the following restricted meals:
      | vegetarian | 0 |
      | ice cream  | 0 |
    And restaurant "Generic Chain 1" has 10 meals left with the following restricted meals:
      | vegetarian | 0 |
    And restaurant "Generic Chain 2" has 18 meals left with the following restricted meals:
      | vegetarian | 10 |
      | ice cream  |  8 |
    And restaurant "Meat Shack" has no meals left



