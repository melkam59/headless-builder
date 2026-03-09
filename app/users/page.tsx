import { db } from '@/db';
import { users } from '@/db/schema';

export default async function UsersPage() {
  const allUsers = await db.select().from(users);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        {allUsers.length === 0 ? (
          <p className="text-gray-500">No users found</p>
        ) : (
          <ul className="space-y-4">
            {allUsers.map((user) => (
              <li key={user.id} className="border-b pb-4">
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-xs text-gray-400">
                  {user.createdAt.toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
