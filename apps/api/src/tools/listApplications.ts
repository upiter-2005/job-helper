import { APPLICATION_STATUS } from "../consts/application.consts.js";

const appStatus = Object.values(APPLICATION_STATUS)


export const listApplicationsTool = {
    name: "list_applications",
    description: "следует вызвать если попросили вернуть список откликов. Запрос может прийти с указанием статуса откликов",
    input_schema: {
      type: "object",
      properties: {
        status: {
            type: "string", 
            description: "состояние отклика, например wishlist, applied, rejected",
            enum: [...appStatus],
        }
      }
    }
  }