Feature: Ordering a mix of meal types, trying to come up with scenarios the implementation doesn't handle correctly

  Scenario: Order 100 meals from multiple restaurants which can all be satisfied and one restaurant is not used
    Given we wish to order 100 meals including restricted meals:
      | gluten free | 30 |
      | vegetarian  | 20 |
      | nut free    | 20 |
    And restaurant "A" has a rating of 1 and can serve a total of 20 meals including restricted meals:
      | vegetarian | 20 |
    And restaurant "B" has a rating of 2 and can serve a total of 30 meals including restricted meals:
      | gluten free | 20 |
      | nut free    | 10 |
    And restaurant "C" has a rating of 5 and can serve a total of 10 meals
    And restaurant "D" has a rating of 5 and can serve a total of 10 meals including restricted meals:
      | nut free    | 5 |
      | gluten free | 5 |
    And restaurant "E" has a rating of 3 and can serve a total of 50 meals including restricted meals:
      | nut free    | 10 |
      | gluten free | 10 |
      | vegetarian  | 20 |
    When we use the automated-orders app to determine the best possible orders
    Then we expect no orders to be unsatisfied
    And we expect to order from restaurant "C" 10 unrestricted meals
    And we expect to order from restaurant "D" 0 unrestricted meals and the following restricted meals:
      | nut free    | 5 |
      | gluten free | 5 |
    And we expect to order from restaurant "E" 10 unrestricted meals and the following restricted meals:
      | nut free    | 10 |
      | gluten free | 10 |
      | vegetarian  | 20 |
    And we expect to order from restaurant "B" 10 unrestricted meals and the following restricted meals:
      | gluten free | 15 |
      | nut free    |  5 |
    And we expect to order from restaurant "A" 0 unrestricted meals
    And restaurant "C" has no meals left
    And restaurant "D" has no meals left
    And restaurant "E" has no meals left
    And restaurant "B" has no meals left
    And restaurant "A" has 20 meals left with the following restricted meals:
      | vegetarian | 20 |

  Scenario: Order 100 meals from a single restaurant that can't all be satisfied
    Given we wish to order 100 meals including restricted meals:
      | vegetarian | 10 |
      | caviar     |  1 |
    And restaurant "A" has a rating of 1 and can serve a total of 50 meals including restricted meals:
      | vegetarian | 20 |
    When we use the automated-orders app to determine the best possible orders
    Then we expect to order from restaurant "A" 40 unrestricted meals and the following restricted meals:
      | vegetarian | 10 |
    And restaurant "A" has no meals left
    And we expect 49 unrestricted meals are unsatisfied and the following restricted meals are unsatisfied:
      | caviar     |  1 |

  Scenario: Order 100 meals from multiple restaurants that can't satisfy all restrictions
    Given we wish to order 100 meals including restricted meals:
      | nut free | 30 |
      | bread    | 10 |
    And restaurant "A" has a rating of 1 and can serve a total of 100 meals including restricted meals:
      | unrelated | 30 |
      | bread     | 20 |
    And restaurant "B" has a rating of 2 and can serve a total of 30 meals including restricted meals:
      | bread     | 5 |
    And restaurant "C" has a rating of 3 and can serve a total of 30 meals
    And restaurant "D" has a rating of 4 and can serve a total of 40 meals including restricted meals:
      | nut free | 20 |
    When we use the automated-orders app to determine the best possible orders
    Then we expect to order from restaurant "D" 20 unrestricted meals and the following restricted meals:
      | nut free | 20 |
    And we expect to order from restaurant "C" 30 unrestricted meals
    And we expect to order from restaurant "B" 10 unrestricted meals and the following restricted meals:
      | bread | 5 |
    And we expect to order from restaurant "A" 0 unrestricted meals and the following restricted meals:
      | bread | 5 |
    And we expect 0 unrestricted meals are unsatisfied and the following restricted meals are unsatisfied:
      | nut free | 10 |
    And restaurant "D" has no meals left
    And restaurant "C" has no meals left
    And restaurant "B" has 15 meals left
    And restaurant "A" has 95 meals left with the following restricted meals:
      | bread     | 15 |
      | unrelated | 30 |

  Scenario: Order 100 meals from multiple restaurants where restrictions can be satisfied but not unrestricted
    Given we wish to order 100 meals including restricted meals:
      | nut free   | 10 |
      | vegetarian | 10 |
      | tacos      | 20 |
    And restaurant "taco bell" has a rating of 0 and can serve a total of 30 meals including restricted meals:
      | tacos | 30 |
    And restaurant "food palace" has a rating of 2 and can serve a total of 20 meals including restricted meals:
      | nut free   | 10 |
      | vegetarian | 10 |
    And restaurant "dubious establishment" has a rating of 3 and can serve a total of 20 meals including restricted meals:
      | nut free | 5 |
    When we use the automated-orders app to determine the best possible orders
    Then we expect to order from restaurant "dubious establishment" 15 unrestricted meals and the following restricted meals:
      | nut free | 5 |
    And we expect to order from restaurant "food palace" 5 unrestricted meals and the following restricted meals:
      | nut free   |  5 |
      | vegetarian | 10 |
    And we expect to order from restaurant "taco bell" 10 unrestricted meals and the following restricted meals:
      | tacos | 20 |
    And we expect 30 unrestricted meals are unsatisfied and the following restricted meals are unsatisfied:
      | nut free   | 0 |
      | vegetarian | 0 |
      | tacos      | 0 |
    And restaurant "dubious establishment" has no meals left
    And restaurant "food palace" has no meals left
    And restaurant "taco bell" has no meals left
