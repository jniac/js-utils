# Stack

It's all about subscribing and unsubscribing. Things are quite simple when the stack is never touched during its own update loop.  
But when it happens... omg!  

Stack has a flag `locked` which turns to be true when `Stack.execute/dump` is called.  
When the flag is true `stack.add/stack.remove` are automatically delayed to the end of the `execute()` method.
