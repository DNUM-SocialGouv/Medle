/**
 * Trigger for updating the act's column updated_at automatically.
 *
 */
exports.up = `
    create trigger updated_at_auto before update on acts
    for each row execute procedure updated_at_auto();
`

exports.down = `
    drop trigger if exists updated_at_auto on acts;
`
