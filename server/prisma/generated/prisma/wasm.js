
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  login: 'login',
  email: 'email',
  password: 'password',
  avatarUrl: 'avatarUrl',
  enabledTwoFactor: 'enabledTwoFactor',
  balance: 'balance',
  role: 'role',
  verificationStatus: 'verificationStatus',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CourseScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  userId: 'userId',
  isFree: 'isFree',
  price: 'price',
  visibility: 'visibility',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  organizationId: 'organizationId'
};

exports.Prisma.CourseModuleScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  courseId: 'courseId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LessonScalarFieldEnum = {
  id: 'id',
  title: 'title',
  courseModuleId: 'courseModuleId',
  order: 'order',
  goals: 'goals',
  content: 'content',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BlockInfoScalarFieldEnum = {
  id: 'id',
  blockReason: 'blockReason',
  bannedId: 'bannedId',
  bannedBy: 'bannedBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  userId: 'userId',
  appealId: 'appealId'
};

exports.Prisma.TwoVerificationCodeScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  code: 'code',
  isUsed: 'isUsed',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RefreshTokenScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  tokenValue: 'tokenValue',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PaymentScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  count: 'count',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TransactionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  price: 'price',
  courseId: 'courseId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OrganizationScalarFieldEnum = {
  id: 'id',
  name: 'name',
  logo: 'logo',
  description: 'description',
  images: 'images',
  inviteCode: 'inviteCode',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  userId: 'userId'
};

exports.Prisma.OrganizationMemberScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  userId: 'userId',
  joinedAt: 'joinedAt'
};

exports.Prisma.HeatmapDataScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  date: 'date',
  actionsCount: 'actionsCount'
};

exports.Prisma.TermScalarFieldEnum = {
  id: 'id',
  type: 'type',
  name: 'name',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CourseTermScalarFieldEnum = {
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  termId: 'termId',
  courseId: 'courseId'
};

exports.Prisma.AppealScalarFieldEnum = {
  id: 'id',
  text: 'text',
  banInfoId: 'banInfoId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  userId: 'userId'
};

exports.Prisma.AdminActionsScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  targetUserId: 'targetUserId',
  actionType: 'actionType',
  reason: 'reason',
  createdAt: 'createdAt'
};

exports.Prisma.UserCourseProgressScalarFieldEnum = {
  id: 'id',
  completedLessons: 'completedLessons',
  completedModules: 'completedModules',
  progress: 'progress',
  totalLessons: 'totalLessons',
  completedLessonsCount: 'completedLessonsCount',
  startedAt: 'startedAt',
  lastActivityAt: 'lastActivityAt',
  completedAt: 'completedAt',
  userId: 'userId',
  currentModuleId: 'currentModuleId',
  currentLessonId: 'currentLessonId',
  courseId: 'courseId'
};

exports.Prisma.ReviewScalarFieldEnum = {
  id: 'id',
  text: 'text',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  userId: 'userId',
  courseId: 'courseId'
};

exports.Prisma.PurchasedCourseScalarFieldEnum = {
  id: 'id',
  courseId: 'courseId',
  userId: 'userId'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.Roles = exports.$Enums.Roles = {
  ADMIN: 'ADMIN',
  USER: 'USER'
};

exports.UserVerificationStatuses = exports.$Enums.UserVerificationStatuses = {
  VERIFIED: 'VERIFIED',
  PENDING: 'PENDING',
  REJECTED: 'REJECTED',
  UNVERIFIED: 'UNVERIFIED'
};

exports.VisibilityTypes = exports.$Enums.VisibilityTypes = {
  ORGANIZATION: 'ORGANIZATION',
  COMMON: 'COMMON'
};

exports.TermTypes = exports.$Enums.TermTypes = {
  CATEGORY: 'CATEGORY',
  TAG: 'TAG'
};

exports.ActionsTypes = exports.$Enums.ActionsTypes = {
  VERIFY: 'VERIFY',
  BAN: 'BAN',
  UNBAN: 'UNBAN',
  DENY: 'DENY'
};

exports.Prisma.ModelName = {
  User: 'User',
  Course: 'Course',
  CourseModule: 'CourseModule',
  Lesson: 'Lesson',
  BlockInfo: 'BlockInfo',
  TwoVerificationCode: 'TwoVerificationCode',
  RefreshToken: 'RefreshToken',
  Payment: 'Payment',
  Transaction: 'Transaction',
  Organization: 'Organization',
  OrganizationMember: 'OrganizationMember',
  HeatmapData: 'HeatmapData',
  Term: 'Term',
  CourseTerm: 'CourseTerm',
  Appeal: 'Appeal',
  AdminActions: 'AdminActions',
  UserCourseProgress: 'UserCourseProgress',
  Review: 'Review',
  PurchasedCourse: 'PurchasedCourse'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
