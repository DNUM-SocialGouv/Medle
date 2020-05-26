/* eslint-disable */
exports.seed = function(knex) {
   return knex("askers").then(function() {
      return knex("askers").insert([
         {"id":1,"name":"Tribunal de grande instance de Montargis","type":"tgi"},
         {"id":2,"name":"Tribunal de grande instance d'Orléans","type":"tgi"},
         {"id":3,"name":"Tribunal de grande instance de Tours","type":"tgi"},
         {"id":4,"name":"Tribunal de grande instance de Lorient","type":"tgi"},
         {"id":5,"name":"Tribunal de grande instance de Vannes","type":"tgi"},
         {"id":6,"name":"Tribunal de grande instance d'Avesnes-sur-Helpe","type":"tgi"},
         {"id":7,"name":"Tribunal de grande instance de Dunkerque","type":"tgi"},
         {"id":8,"name":"Tribunal de grande instance de Valenciennes","type":"tgi"},
         {"id":9,"name":"Tribunal de grande instance de Cambrai","type":"tgi"},
         {"id":10,"name":"Tribunal de grande instance de Douai","type":"tgi"},
         {"id":11,"name":"Tribunal de grande instance de Lille","type":"tgi"},
         {"id":12,"name":"Tribunal de grande instance de Valence","type":"tgi"},
         {"id":13,"name":"Tribunal de grande instance de Grasse","type":"tgi"},
         {"id":14,"name":"Tribunal de grande instance de Nice","type":"tgi"},
         {"id":15,"name":"Tribunal de grande instance du Mans","type":"tgi"},
         {"id":16,"name":"Tribunal de grande instance de Charleville-Mézières","type":"tgi"},
         {"id":17,"name":"Tribunal de grande instance de Metz","type":"tgi"},
         {"id":18,"name":"Tribunal de grande instance de Sarreguemines","type":"tgi"},
         {"id":19,"name":"Tribunal de grande instance de Thionville","type":"tgi"},
         {"id":20,"name":"Tribunal de grande instance de Belfort","type":"tgi"},
         {"id":21,"name":"Tribunal de grande instance d'Alençon","type":"tgi"},
         {"id":22,"name":"Tribunal de grande instance d'Argentan","type":"tgi"},
         {"id":23,"name":"Tribunal de grande instance de Carpentras","type":"tgi"},
         {"id":24,"name":"Tribunal de grande instance d'Avignon","type":"tgi"},
         {"id":25,"name":"Tribunal de grande instance de Guéret","type":"tgi"},
         {"id":26,"name":"Tribunal de grande instance de Tarbes","type":"tgi"},
         {"id":27,"name":"Tribunal de grande instance de Colmar","type":"tgi"},
         {"id":28,"name":"Tribunal de grande instance de Mulhouse","type":"tgi"},
         {"id":29,"name":"Tribunal de grande instance de Rodez","type":"tgi"},
         {"id":30,"name":"Tribunal de grande instance de Dijon","type":"tgi"},
         {"id":31,"name":"Tribunal de grande instance de Saint-Nazaire","type":"tgi"},
         {"id":32,"name":"Tribunal de grande instance de Nantes","type":"tgi"},
         {"id":33,"name":"Tribunal de grande instance de Saint-Brieuc","type":"tgi"},
         {"id":34,"name":"Tribunal de Première Instance de Nouméa","type":"tgi"},
         {"id":35,"name":"Section Détachée du Tribunal de Première Instance à Lifou","type":"tgi"},
         {"id":36,"name":"Section Détachée du Tribunal de Première Instance à Koné","type":"tgi"},
         {"id":37,"name":"Tribunal de grande instance de Bordeaux","type":"tgi"},
         {"id":38,"name":"Tribunal de grande instance de Libourne","type":"tgi"},
         {"id":39,"name":"Tribunal de grande instance de Niort","type":"tgi"},
         {"id":40,"name":"Tribunal de grande instance de Limoges","type":"tgi"},
         {"id":41,"name":"Tribunal de grande instance d'Aurillac","type":"tgi"},
         {"id":42,"name":"Tribunal de grande instance de Montluçon","type":"tgi"},
         {"id":43,"name":"Tribunal de grande instance de Cusset","type":"tgi"},
         {"id":44,"name":"Tribunal de grande instance de Moulins","type":"tgi"},
         {"id":45,"name":"Tribunal de grande instance de Bourgoin-Jallieu","type":"tgi"},
         {"id":46,"name":"Tribunal de grande instance de Vienne","type":"tgi"},
         {"id":47,"name":"Tribunal de grande instance de Grenoble","type":"tgi"},
         {"id":48,"name":"Tribunal de grande instance de Saint-Omer","type":"tgi"},
         {"id":49,"name":"Tribunal de grande instance d'Arras","type":"tgi"},
         {"id":50,"name":"Tribunal de grande instance de Boulogne-sur-Mer","type":"tgi"},
         {"id":51,"name":"Tribunal de grande instance de Béthune","type":"tgi"},
         {"id":52,"name":"Tribunal de grande instance de Quimper","type":"tgi"},
         {"id":53,"name":"Tribunal de grande instance de Brest","type":"tgi"},
         {"id":54,"name":"Tribunal de grande instance de Versailles","type":"tgi"},
         {"id":55,"name":"Tribunal de grande instance de Rouen","type":"tgi"},
         {"id":56,"name":"Tribunal de grande instance du Havre","type":"tgi"},
         {"id":57,"name":"Tribunal de grande instance de Dieppe","type":"tgi"},
         {"id":58,"name":"Tribunal de grande instance de Bayonne","type":"tgi"},
         {"id":59,"name":"Tribunal de grande instance de Pau","type":"tgi"},
         {"id":60,"name":"Tribunal de grande instance d'Epinal","type":"tgi"},
         {"id":61,"name":"Tribunal de grande instance de Roanne","type":"tgi"},
         {"id":62,"name":"Tribunal de grande instance de Saint-Etienne","type":"tgi"},
         {"id":63,"name":"Tribunal de grande instance d'Angoulême","type":"tgi"},
         {"id":64,"name":"Tribunal de grande instance de Privas","type":"tgi"},
         {"id":65,"name":"Tribunal de grande instance de Digne-les-Bains","type":"tgi"},
         {"id":66,"name":"Tribunal de grande instance d'Albi","type":"tgi"},
         {"id":67,"name":"Tribunal de grande instance de Castres","type":"tgi"},
         {"id":68,"name":"Tribunal de grande instance de Lons-le-Saunier","type":"tgi"},
         {"id":69,"name":"Tribunal de grande instance d'Albertville","type":"tgi"},
         {"id":70,"name":"Tribunal de grande instance de Chambéry","type":"tgi"},
         {"id":71,"name":"Tribunal de grande instance de Vesoul","type":"tgi"},
         {"id":72,"name":"Tribunal de grande instance de Bobigny","type":"tgi"},
         {"id":73,"name":"Tribunal de grande instance de Foix","type":"tgi"},
         {"id":74,"name":"Tribunal de grande instance de Cayenne","type":"tgi"},
         {"id":75,"name":"Tribunal de grande instance de La Rochelle","type":"tgi"},
         {"id":76,"name":"Tribunal de grande instance de Saintes","type":"tgi"},
         {"id":77,"name":"Tribunal de grande instance de Perpignan","type":"tgi"},
         {"id":78,"name":"Tribunal de grande instance de Reims","type":"tgi"},
         {"id":79,"name":"Tribunal de grande instance de Châlons-en-Champagne","type":"tgi"},
         {"id":80,"name":"Tribunal de grande instance de Nîmes","type":"tgi"},
         {"id":81,"name":"Tribunal de grande instance d'Alès","type":"tgi"},
         {"id":82,"name":"Tribunal de grande instance de Périgueux","type":"tgi"},
         {"id":83,"name":"Tribunal de grande instance de Bergerac","type":"tgi"},
         {"id":84,"name":"Tribunal de grande instance de Poitiers","type":"tgi"},
         {"id":85,"name":"Tribunal de grande instance d'Angers","type":"tgi"},
         {"id":86,"name":"Tribunal de grande instance de Saumur","type":"tgi"},
         {"id":87,"name":"Tribunal de grande instance de Meaux","type":"tgi"},
         {"id":88,"name":"Tribunal de grande instance de Melun","type":"tgi"},
         {"id":89,"name":"Tribunal de grande instance de Fontainebleau","type":"tgi"},
         {"id":90,"name":"Tribunal de grande instance de Bastia","type":"tgi"},
         {"id":91,"name":"Tribunal de grande instance de Dax","type":"tgi"},
         {"id":92,"name":"Tribunal de grande instance de Mont-de-Marsan","type":"tgi"},
         {"id":93,"name":"Tribunal de grande instance de Beauvais","type":"tgi"},
         {"id":94,"name":"Tribunal de grande instance de Senlis","type":"tgi"},
         {"id":95,"name":"Tribunal de grande instance de Compiègne","type":"tgi"},
         {"id":96,"name":"Tribunal de grande instance de La Roche-sur-Yon","type":"tgi"},
         {"id":97,"name":"Tribunal de grande instance des Sables-d'Olonne","type":"tgi"},
         {"id":98,"name":"Tribunal de Première Instance de Mata-Utu","type":"tgi"},
         {"id":99,"name":"Tribunal de grande instance de Lisieux","type":"tgi"},
         {"id":100,"name":"Tribunal de grande instance de Caen","type":"tgi"},
         {"id":101,"name":"Tribunal de Première Instance de Saint-Pierre-et-Miquelon","type":"tgi"},
         {"id":102,"name":"Tribunal de grande instance de Chaumont","type":"tgi"},
         {"id":103,"name":"Tribunal de grande instance de Nanterre","type":"tgi"},
         {"id":104,"name":"Tribunal de grande instance de Fort-de-France","type":"tgi"},
         {"id":105,"name":"Tribunal de grande instance de Saint-Quentin","type":"tgi"},
         {"id":106,"name":"Tribunal de grande instance de Laon","type":"tgi"},
         {"id":107,"name":"Tribunal de grande instance de Soissons","type":"tgi"},
         {"id":108,"name":"Tribunal de grande instance de Chartres","type":"tgi"},
         {"id":109,"name":"Tribunal de grande instance de Thonon-les-Bains","type":"tgi"},
         {"id":110,"name":"Tribunal de grande instance de Bonneville","type":"tgi"},
         {"id":111,"name":"Tribunal de grande instance d'Annecy","type":"tgi"},
         {"id":112,"name":"Tribunal de grande instance de Toulon","type":"tgi"},
         {"id":113,"name":"Tribunal de grande instance de Draguignan","type":"tgi"},
         {"id":114,"name":"Tribunal de grande instance de Saint-Denis-de-La-Réunion","type":"tgi"},
         {"id":115,"name":"Tribunal de grande instance de Saint-Pierre","type":"tgi"},
         {"id":116,"name":"Tribunal de grande instance de Gap","type":"tgi"},
         {"id":117,"name":"Tribunal de grande instance d'Aix-en-Provence","type":"tgi"},
         {"id":118,"name":"Tribunal de grande instance de Tarascon","type":"tgi"},
         {"id":119,"name":"Tribunal de grande instance de Marseille","type":"tgi"},
         {"id":120,"name":"Tribunal de grande instance de Laval","type":"tgi"},
         {"id":121,"name":"Tribunal de grande instance d'Amiens","type":"tgi"},
         {"id":122,"name":"Tribunal de grande instance de Troyes","type":"tgi"},
         {"id":123,"name":"Tribunal de grande instance de Pointe-à-Pitre","type":"tgi"},
         {"id":124,"name":"Tribunal de grande instance de Basse-Terre","type":"tgi"},
         {"id":125,"name":"Tribunal de grande instance d'Evreux","type":"tgi"},
         {"id":126,"name":"Tribunal de grande instance de Carcassonne","type":"tgi"},
         {"id":127,"name":"Tribunal de grande instance de Narbonne","type":"tgi"},
         {"id":128,"name":"Tribunal de grande instance de Mende","type":"tgi"},
         {"id":129,"name":"Tribunal de grande instance de Blois","type":"tgi"},
         {"id":130,"name":"Tribunal de grande instance d'Auch","type":"tgi"},
         {"id":131,"name":"Tribunal de grande instance de Besançon","type":"tgi"},
         {"id":132,"name":"Tribunal de grande instance de Montbéliard","type":"tgi"},
         {"id":133,"name":"Tribunal de grande instance de Paris","type":"tgi"},
         {"id":134,"name":"Tribunal de grande instance d'Auxerre","type":"tgi"},
         {"id":135,"name":"Tribunal de grande instance de Sens","type":"tgi"},
         {"id":136,"name":"Tribunal de grande instance de Nevers","type":"tgi"},
         {"id":137,"name":"Tribunal de grande instance de Cherbourg-en-Cotentin","type":"tgi"},
         {"id":138,"name":"Tribunal de grande instance de Coutances","type":"tgi"},
         {"id":139,"name":"Tribunal de grande instance d'Ajaccio","type":"tgi"},
         {"id":140,"name":"Tribunal de grande instance de Pontoise","type":"tgi"},
         {"id":141,"name":"Tribunal de grande instance de Verdun","type":"tgi"},
         {"id":142,"name":"Tribunal de grande instance de Bar-le-Duc","type":"tgi"},
         {"id":143,"name":"Tribunal de grande instance de Créteil","type":"tgi"},
         {"id":144,"name":"Tribunal de grande instance de Bourg-en-Bresse","type":"tgi"},
         {"id":145,"name":"Tribunal de grande instance de Montauban","type":"tgi"},
         {"id":146,"name":"Tribunal de grande instance de Châteauroux","type":"tgi"},
         {"id":147,"name":"Tribunal de grande instance de Cahors","type":"tgi"},
         {"id":148,"name":"Tribunal de grande instance de Chalon-sur-Saône","type":"tgi"},
         {"id":149,"name":"Tribunal de grande instance de Mâcon","type":"tgi"},
         {"id":150,"name":"Tribunal de grande instance de Rennes","type":"tgi"},
         {"id":151,"name":"Tribunal de grande instance de Saint-Malo","type":"tgi"},
         {"id":152,"name":"Tribunal de grande instance du Puy-en-Velay","type":"tgi"},
         {"id":153,"name":"Tribunal de grande instance de Brive-la-Gaillarde","type":"tgi"},
         {"id":154,"name":"Tribunal de grande instance de Tulle","type":"tgi"},
         {"id":155,"name":"Tribunal de grande instance de Mamoudzou","type":"tgi"},
         {"id":156,"name":"Tribunal de grande instance d'Evry","type":"tgi"},
         {"id":157,"name":"Tribunal de grande instance d'Agen","type":"tgi"},
         {"id":158,"name":"Tribunal de grande instance de Villefranche-sur-Saône","type":"tgi"},
         {"id":159,"name":"Tribunal de grande instance de Lyon","type":"tgi"},
         {"id":160,"name":"Section Détachée du Tribunal de Première Instance à Nuku-Hiva","type":"tgi"},
         {"id":161,"name":"Tribunal de Première Instance de Papeete","type":"tgi"},
         {"id":162,"name":"Section Détachée du Tribunal de Première Instance à Raïatéa","type":"tgi"},
         {"id":163,"name":"Tribunal de grande instance de Clermont-Ferrand","type":"tgi"},
         {"id":164,"name":"Tribunal de grande instance de Strasbourg","type":"tgi"},
         {"id":165,"name":"Tribunal de grande instance de Saverne","type":"tgi"},
         {"id":166,"name":"Tribunal de grande instance de Béziers","type":"tgi"},
         {"id":167,"name":"Tribunal de grande instance de Montpellier","type":"tgi"},
         {"id":168,"name":"Tribunal de grande instance de Toulouse","type":"tgi"},
         {"id":169,"name":"Tribunal de grande instance de St Gaudens","type":"tgi"},
         {"id":170,"name":"Tribunal de grande instance de Bourges","type":"tgi"},
         {"id":171,"name":"Tribunal de grande instance de Val de Briey","type":"tgi"},
         {"id":172,"name":"Tribunal de grande instance de Nancy","type":"tgi"},
         {"id":173,"name":"Commissariat de police d'Olivet","type":"commissariat_police"},
         {"id":174,"name":"Commissariat de police de Montargis","type":"commissariat_police"},
         {"id":175,"name":"Commissariat de police d'Orléans La Source","type":"commissariat_police"},
         {"id":176,"name":"Commissariat de police d'Orléans","type":"commissariat_police"},
         {"id":177,"name":"Commissariat de police de Saint-Pierre-des-Corps","type":"commissariat_police"},
         {"id":178,"name":"Commissariat de police de Tours","type":"commissariat_police"},
         {"id":179,"name":"Commissariat de police de Joué-les-Tours","type":"commissariat_police"},
         {"id":180,"name":"Commissariat de police de Lanester","type":"commissariat_police"},
         {"id":181,"name":"Commissariat de police de Vannes","type":"commissariat_police"},
         {"id":182,"name":"Commissariat de police de Lorient","type":"commissariat_police"},
         {"id":183,"name":"Commissariat de police de Dunkerque","type":"commissariat_police"},
         {"id":184,"name":"Commissariat de police de Bailleul","type":"commissariat_police"},
         {"id":185,"name":"Commissariat de police de Wattrelos","type":"commissariat_police"},
         {"id":186,"name":"Commissariat de police de Raismes","type":"commissariat_police"},
         {"id":187,"name":"Commissariat de police d'Anzin","type":"commissariat_police"},
         {"id":188,"name":"Commissariat de police de Lille - Bureau de Wazemmes","type":"commissariat_police"},
         {"id":189,"name":"Commissariat de police de Haubourdin","type":"commissariat_police"},
         {"id":190,"name":"Commissariat de police d'Armentières","type":"commissariat_police"},
         {"id":191,"name":"Commissariat de police de Condé-sur-l'Escaut","type":"commissariat_police"},
         {"id":192,"name":"Commissariat de police d'Auby","type":"commissariat_police"},
         {"id":193,"name":"Commissariat de police de Faches-Thumesnil","type":"commissariat_police"},
         {"id":194,"name":"Commissariat de police de Valenciennes","type":"commissariat_police"},
         {"id":195,"name":"Commissariat de police de Denain","type":"commissariat_police"},
         {"id":196,"name":"Commissariat de police de Roubaix","type":"commissariat_police"},
         {"id":197,"name":"Commissariat de police de Lille - Poste de Fives","type":"commissariat_police"},
         {"id":198,"name":"Commissariat de police de Marcq-en-Baroeul","type":"commissariat_police"},
         {"id":199,"name":"Commissariat de police de Mouvaux","type":"commissariat_police"},
         {"id":200,"name":"Bureau de police de Roncq","type":"commissariat_police"},
         {"id":3827,"name":"Brigade de gendarmerie - Dombasle-sur-Meurthe","type":"gendarmerie"},
         {"id":3828,"name":"Brigade de gendarmerie - Colombey-les-Belles","type":"gendarmerie"},
         {"id":3829,"name":"Brigade de gendarmerie - Frouard","type":"gendarmerie"},
         {"id":3830,"name":"Brigade de gendarmerie - Cirey-sur-Vezouze","type":"gendarmerie"},
         {"id":3831,"name":"Brigade de gendarmerie - Dieulouard","type":"gendarmerie"},
         {"id":3832,"name":"Brigade de gendarmerie - Audun-le-Roman","type":"gendarmerie"},
         {"id":3833,"name":"Brigade de gendarmerie - Trieux","type":"gendarmerie"},
         {"id":3834,"name":"Brigade de gendarmerie - Longuyon","type":"gendarmerie"},
         {"id":3835,"name":"Brigade de gendarmerie - Liverdun","type":"gendarmerie"},
         {"id":3836,"name":"Brigade de gendarmerie - Pagny-sur-Moselle","type":"gendarmerie"},
         {"id":3837,"name":"Brigade de gendarmerie - Lunéville","type":"gendarmerie"},
         {"id":3838,"name":"Brigade de gendarmerie - Haroué","type":"gendarmerie"},
         {"id":3839,"name":"Brigade de gendarmerie - Thiaucourt-Regniéville","type":"gendarmerie"},
         {"id":3840,"name":"Brigade de gendarmerie - Gerbéviller","type":"gendarmerie"},
         {"id":3841,"name":"Brigade de gendarmerie - Blainville-sur-l'Eau","type":"gendarmerie"},
         {"id":3842,"name":"Brigade de gendarmerie - Vézelise","type":"gendarmerie"},
         {"id":3843,"name":"Brigade de gendarmerie - Jarny","type":"gendarmerie"},
         {"id":3844,"name":"Brigade de gendarmerie - Baccarat","type":"gendarmerie"},
         {"id":3845,"name":"Brigade de gendarmerie - Toul","type":"gendarmerie"},
         {"id":3846,"name":"Brigade de gendarmerie - Mars-la-Tour","type":"gendarmerie"},
         {"id":3847,"name":"Brigade de gendarmerie - Foug","type":"gendarmerie"},
         {"id":3848,"name":"Brigade de gendarmerie - Piennes","type":"gendarmerie"},
         {"id":3849,"name":"OFPRA (Office Français de Protection des Réfugiés et Apatrides)","type":"primary"},
         {"id":3850,"name":"Ministère de l'intérieur","type":"primary"},
         {"id":3851,"name":"Police aux frontières","type":"primary"},
         {"id":3852,"name":"Brigade financière","type":"primary"},
         {"id":3853,"name":"Parquet national antiterroriste","type":"primary"},
         {"id":3854,"name":"Douane judiciaire","type":"primary"},
         {"id":3855,"name":"CRS autoroutière","type":"primary"},
         {"id":3856,"name":"Juge d'instruction","type":"primary"},
         {"id":3857,"name":"Commissariat de police de Cachan","type":"commissariat_police"},
         {"id":3858,"name":"Commissariat de police de Chevilly-Larue","type":"commissariat_police"},
         {"id":3859,"name":"Commissariat de police de Thiais","type":"commissariat_police"},
         {"id":3860,"name":"Commissariat de police de Villejuif","type":"commissariat_police"}
      ])
   })
   .then(function () {
      return knex.raw(
        "select pg_catalog.setval(pg_get_serial_sequence('askers', 'id'), (select max(id) from askers) + 1);"
      )
    })

}
