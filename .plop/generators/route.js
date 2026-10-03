// .plop/generators/route.js

module.exports = {
    description: "Crea una nuova route",
    prompts: [
      {
        type: "input",
        name: "routeName",
        message: "Inserisci il nome della route (es. menu): ",
        validate: function (value) {
          if (!/.+/.test(value)) {
            return "Devi inserire un nome per la route";
          }
          return true;
        },
      },
    ],

    actions: [
      // Crea il file page.tsx per la nuova route
      {
        type: "add",
        path: "app/{{kebabCase routeName}}/page.tsx",
        templateFile: ".plop/templates/route/page.hbs",
      },
    ],
  };