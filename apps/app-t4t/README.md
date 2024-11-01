## TODO

- [DONE] change tables loaded from JS to YAML
- [DONE] make the API path configurable
- make the directory to load the YAML files configurable

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

