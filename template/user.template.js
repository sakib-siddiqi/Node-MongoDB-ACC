const NA = null;
module.exports = class User {
  constructor(data) {
    this.id = +data.id;
    this.name = data.name || NA;
    this.gender = data.gender || NA;
    this.contact = data.contact || NA;
    this.address = data.address || NA;
    this.photo_url = data.photo_url || NA;
  }
};
