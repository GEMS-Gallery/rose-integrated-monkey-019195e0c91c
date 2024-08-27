import Text "mo:base/Text";

import Float "mo:base/Float";

actor Calculator {
  public func calculate(operation: Text, num1: Float, num2: Float) : async ?Float {
    switch (operation) {
      case ("+") { ?(num1 + num2) };
      case ("-") { ?(num1 - num2) };
      case ("*") { ?(num1 * num2) };
      case ("/") {
        if (num2 == 0) {
          null
        } else {
          ?(num1 / num2)
        };
      };
      case (_) { null };
    };
  };
}