SELECT grantee, privilege_type
FROM information_schema.role_usage_grants
WHERE object_name = 'lancamento_id_seq';

GRANT USAGE, SELECT, UPDATE ON SEQUENCE lancamento_id_seq TO financial_user;