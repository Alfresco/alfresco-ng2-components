---
Title: Type cast pipe
Added: v6.0.0
Status: Active
Last reviewed: 2023-05-23
---

# [Type Cast pipe](../../../lib/core/src/lib/pipes/type-cast.pipe.ts "Defined in user-initial.pipe.ts")

Takes a reference to a constructor and then type casts the provided object to the type of that constructor. 

## Basic Usage

<!-- {% raw %} -->
```TS
    protected readonly MyCustomTypeConstructor = MyCustomTypeConstructor
```
```HTML
<div>
    <my-comp [inputProp]="someVar | cast : MyCustomTypeConstructor"></my-comp>
</div>
```

<!-- {% endraw %} -->

## Details

The pipe takes a reference of a constructor to which the typecasting is to be done. 
Preferably, this should be declared a readonly property in the .ts file for the component,
and have the same name as the constructor, matching its casing. This is optional, 
but would improve the readability of the code.

Once the reference has been declared in the typescript file, the pipe can then be used in the template,
by providing the constructor reference as shown above. In the example above, the input data property
`inputProp` has a type of `MyCustomTypeConstructor`, and would expect data of that type only. 

