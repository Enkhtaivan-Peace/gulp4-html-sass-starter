class User{
    constructor( id, name, age ){
        this.id = id;
        this.name = name;
        this.age = age;
    }
    getId(){
        return this.id;
    }
    setId(id){
        this.id = id
    }
    toString(){
        return {
            id: this.id,
            name: this.name,
            age: this.age
        }
    }
}