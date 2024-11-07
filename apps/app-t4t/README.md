## TODO

- [DONE] change tables loaded from JS to YAML
- [DONE] make the API path configurable
- [DONE] make the directory to load the YAML files configurable
- [DONE] single/multiple file upload - to folder

// TBD - DB set user For Audit Logs
// audit tables - in progress
// RBAC - in progress
// auto detect yaml / json
// file upload options...? - in progress
// file delete - to folder
// file upload - to oss
// file delete - to oss
// import / export
// table for tables
// Test access rights

// filter file inputs...
// [UI] handle multiple images display...
// [UI] required * label in form
// [UI] UPLOAD CSV, Download CSV
// [UI] AUTO COMPLETE
// filters, create, delete (multi select)
// [UI] i18n
// [UI] clear all filters button



## Learning To Use

1. use t4t.http as API reference and testing
2. schema for describing tables is in the tables folder

## Schema

student
grade
country
state


## Validation

### HTML input types

- unhandled: button, image, hidden, reset, submit
- undecided: month, week, search
# checkbox, color, file, radio, range, tel, url, time
- handled: date, datetime-local, email, number, password, text

### input attributs
- ignored
  - size: text, search, tel, url, email, and password
  - readonly
  - step: number, range, date, datetime-local, month, time and week.
- dynamic
  - disabled
  - required: text, search, url, tel, email, password, date pickers, number, checkbox, radio, and file
- in use
  - maxlength
  - min, max: number, range, date, datetime-local, month, time and week
  - multiple: email, file
  - pattern: text, date, search, url, tel, email, and password.

