import { EntityId, Update } from "@reduxjs/toolkit";

export type ChildUpdate<T, Id extends EntityId> = {
    id: Id;
    update: Update<T, Id> | ChildUpdate<T, Id>;
};