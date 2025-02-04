-- Role seeder
INSERT INTO Roles (label) 
VALUES 
    ('user'),
    ('admin')
ON CONFLICT DO NOTHING;
