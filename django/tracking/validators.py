from django.core.exceptions import ValidationError


def validate_distinct_list(value):
    # Fast look up for duplicates in the list
    seen = set()
    if any(v in seen or seen.add(v) for v in value):
        raise ValidationError("List should be distinct")
