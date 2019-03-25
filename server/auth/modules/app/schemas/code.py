from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError

code_schema = {
    "type": "object",
    "properties": {
        "Country": {
            "type": "string",
        },
        "CountryCode": {
            "type": "string",
        },
        "Currency": {
            "type": "string",
        },
        "Code": {
            "type": "string",
        }
    },
    "required": ["Country", "Code"],
    "additionalProperties": False
}


def validate_code(data):
    try:
        validate(data, code_schema)
    except ValidationError as e:
        return {'ok': False, 'message': e}
    except SchemaError as e:
        return {'ok': False, 'message': e}
    return {'ok': True, 'data': data}
