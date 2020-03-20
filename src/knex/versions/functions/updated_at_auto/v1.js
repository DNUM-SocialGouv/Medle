/**
 * Stored function for updating tables having column updated_at.
 * Supposed to be invoked by a trigger only.
 */
exports.up = `
    create or replace function updated_at_auto()
    returns trigger as $$
    begin
        new.updated_at = current_timestamp;
        return new;
    end;
    $$ language 'plpgsql';
`

exports.down = `
    drop function if exists updated_at_auto;
`
