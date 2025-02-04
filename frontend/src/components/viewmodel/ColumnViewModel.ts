import { ColumnType } from "./ColumnType";

export class ColumnViewModel{
    public propertyName! : string;
    public title! : string;
    public type! : ColumnType;
    public subProperty : string | null = null

    /**
     *
     */
    constructor(propertyName:string,title:string,type:ColumnType,subProperty:string|null = null) {
        this.propertyName = propertyName,
        this.title = title,
        this.type = type   
        this.subProperty = (subProperty)??null;
    }

    getType(){
        switch (this.type) {
            case ColumnType.BOOLEAN:
                return 'boolean'
                break;
        
                case ColumnType.DEFAULT || ColumnType.JSON:
                return 'string'
                break;

                case ColumnType.DATE:
                return 'date'
                break;
                case ColumnType.IMAGE:
                    return 'img'

            default:
                break;
        }
    }
}