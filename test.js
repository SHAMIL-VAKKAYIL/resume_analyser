console.log(a);
var a = 10

const person = {
    name: "shamil",
};

// const person2 = [1, 2, 3, 4, 5]

function sayHi() {
    console.log("Hi " + this.name);
}

// const fn = sayHi.bind(person2);
// fn()

Function.prototype.myBind = function (context) {
    const fn = this;
    return function () {
        fn.apply(context)
    }
}

const fn = sayHi.myBind(person);
fn()

