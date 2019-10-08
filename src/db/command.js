class Comando {
  constructor(text = "", params = {}) {
    this.text = "";
    this.params = {};
  }

  add(t) {
    this.text += t;
  }

  param(n, v) {
    this.params[n] = v;
  }

  build() {
    let output = this.text;
    let counter = 1;
    let values = [];

    Object.keys(this.params).forEach(p => {
      output = output.replace(":" + p, "$" + counter++);
      values.push(this.params[p]);
    });

    return {
      sql: output,
      values: values
    };
  }
}

const cmd = new Comando();
cmd.add(
  "insert into (nome, idade, email) values (:nome, :idade, :email) returning id"
);
cmd.param("idade", 35);
cmd.param("nome", "herbert");
cmd.param("email", "meupau@hotsecy.com");

const x = cmd.build();

console.log(x.sql, x.values);
