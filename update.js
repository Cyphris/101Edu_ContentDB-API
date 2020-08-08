import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    // 'Key' defines the partition key and sort key of the item to be updated
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'questionId': path parameter
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      questionId: event.pathParameters.id
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: "SET questionStatement = :questionStatement, attachment = :attachment, questionStatus = :questionStatus, questionType = :questionType, assignedTo = :assignedTo, authoredBy = :authoredBy, firstReviewer = :firstReviewer, secReviewer = :secReviewer",
    ExpressionAttributeValues: {
      ":attachment": data.attachment || null,
      ":questionStatement": data.questionStatement || null,
      ":questionType":  data.questionType || null,
      ":questionStatus": data.questionStatus || null,
      ":assignedTo": data.assignedTo || null,
      ":authoredBy": data.authoredBy || null,
      ":firstReviewer": data.firstReviewer || null,
      ":secReviewer": data.secReviewer || null
    },
    // 'ReturnValues' specifies if and how to return the item's attributes,
    // where ALL_NEW returns all attributes of the item after the update; you
    // can inspect 'result' below to see how it works with different settings
    ReturnValues: "ALL_NEW"
  };

  await dynamoDb.update(params);

  return { status: true };
});