exports.triggerUp = function triggerUp(table) {
  return `create trigger updated_at_auto before update on ${table} for each row execute procedure updated_at_auto();`
}

exports.triggerDown = function triggerDown(table) {
  return `drop trigger if exists updated_at_auto on ${table};`
}
