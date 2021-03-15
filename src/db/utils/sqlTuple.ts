import { ValueExpressionType, TaggedTemplateLiteralInvocationType, sql } from "slonik";

export function sqlTuple(...args: ValueExpressionType[]): TaggedTemplateLiteralInvocationType {
    return sql`(${sql.join(args, sql`,`)})`;
}
