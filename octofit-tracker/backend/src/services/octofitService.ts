import { Types } from 'mongoose';
import { Activity, Team, User, Workout } from '../models/index.js';

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null && !Array.isArray(input);
}

export async function listActivities() {
  return Activity.find().lean();
}

export async function createActivity(input: unknown) {
  if (!isRecord(input)) {
    throw Object.assign(new Error('Invalid activity input'), { status: 400 });
  }

  const { userId, teamId, type, minutes } = input;
  if (
    typeof userId !== 'string' ||
    !Types.ObjectId.isValid(userId) ||
    typeof teamId !== 'string' ||
    !Types.ObjectId.isValid(teamId) ||
    typeof type !== 'string' ||
    !type.trim() ||
    typeof minutes !== 'number' ||
    !Number.isFinite(minutes) ||
    minutes < 1
  ) {
    throw Object.assign(new Error('Invalid activity input'), { status: 400 });
  }

  const [user, team] = await Promise.all([
    User.exists({ _id: userId }),
    Team.exists({ _id: teamId }),
  ]);
  if (!user || !team) {
    throw Object.assign(new Error('Activity user or team not found'), { status: 400 });
  }

  return Activity.create({
    user: userId,
    team: teamId,
    type: type.trim(),
    minutes,
    points: minutes,
    occurredAt: new Date(),
  });
}

export async function listTeams() {
  return Team.find().lean();
}

export async function createTeam(input: unknown) {
  if (!isRecord(input)) {
    throw Object.assign(new Error('Invalid team input'), { status: 400 });
  }

  const { name, mascot } = input;
  const members = input.members ?? [];
  if (
    typeof name !== 'string' ||
    !name.trim() ||
    typeof mascot !== 'string' ||
    !mascot.trim() ||
    !Array.isArray(members) ||
    !members.every((member): member is string => typeof member === 'string' && Types.ObjectId.isValid(member))
  ) {
    throw Object.assign(new Error('Invalid team input'), { status: 400 });
  }

  if (members.length > 0) {
    const memberCount = await User.countDocuments({ _id: { $in: members } });
    if (memberCount !== members.length) {
      throw Object.assign(new Error('One or more team members were not found'), { status: 400 });
    }
  }

  return Team.create({ name: name.trim(), mascot: mascot.trim(), members });
}

export async function getLeaderboard() {
  const [activities, teams] = await Promise.all([
    Activity.find().select('team points').lean(),
    Team.find().select('_id name').lean(),
  ]);
  const teamNames = new Map(teams.map((team) => [team._id.toString(), team.name]));
  const totals = new Map<string, number>();

  for (const activity of activities) {
    const teamId = activity.team.toString();
    if (teamNames.has(teamId)) {
      totals.set(teamId, (totals.get(teamId) ?? 0) + activity.points);
    }
  }

  return teams.flatMap((team) => {
    const totalPoints = totals.get(team._id.toString());
    return totalPoints === undefined ? [] : [{ teamName: team.name, totalPoints }];
  })
    .sort((left, right) => right.totalPoints - left.totalPoints)
    .map((team, index) => ({ ...team, rank: index + 1 }));
}

export async function suggestWorkouts(userEmail: string) {
  const user = await User.findOne({ email: userEmail }).lean();
  if (!user) {
    throw Object.assign(new Error('User not found'), { status: 404 });
  }

  const [activities, workouts] = await Promise.all([
    Activity.find({ user: user._id }).sort({ occurredAt: -1 }).select('type').lean(),
    Workout.find().lean(),
  ]);
  const normalize = (value: string) => value.trim().toLowerCase();
  const focusForActivity = (type: string) => {
    const normalizedType = normalize(type);
    return ['run', 'cycle', 'walk'].includes(normalizedType) ? 'endurance' : normalizedType;
  };
  const goal = normalize(user.fitnessGoal);
  const suggestion = workouts.find((workout) => normalize(workout.focus) === goal)
    ?? workouts.find((workout) => activities.some((activity) => focusForActivity(activity.type) === normalize(workout.focus)));

  if (!suggestion) return [];

  const matchingActivity = activities.find((activity) => focusForActivity(activity.type) === normalize(suggestion.focus));
  const reason = matchingActivity
    ? `Recommended for your ${matchingActivity.type} activity and ${user.fitnessGoal} goal`
    : `Recommended for your ${user.fitnessGoal} goal`;

  return [{ ...suggestion, reason }];
}

export { User };
